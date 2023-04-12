import { Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { Book } from "../model/Book.model";

const prisma = new PrismaClient();

interface SearchPaginationSortOptions {
  model: Prisma.ModelName;
  searchableFields: Array<keyof User> | Array<keyof Book>;
}

interface SearchPaginationSortArgs {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

type UserOrderByInput = {
  id?: "asc" | "desc";
  name?: "asc" | "desc";
  email?: "asc" | "desc";
  title?: "asc" | "desc";
};

export const searchPaginationSortMiddleware = ({
  model,
  searchableFields,
}: SearchPaginationSortOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "id",
        order = "asc",
      } = req.query as SearchPaginationSortArgs;

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;
      const orderBy: UserOrderByInput = { [sort]: order };
      const modelName = model.toLowerCase();

      if (!search) {
        const allRecords = await (prisma as any)[modelName].findMany({
          orderBy,
          skip,
          take: limitNum,
        });

        const totalFound = await (prisma as any)[modelName].findMany();
        const found = totalFound.length;
        const totalPages = Math.ceil(found / limitNum);

        res.locals.data = allRecords;
        res.locals.totalPages = totalPages;
        res.locals.currentPage = pageNum;
        res.locals.found = found;

        return next();
      }

      const searchQueries = searchableFields.map((field) => ({
        [field]: { contains: search, mode: "insensitive" },
      }));

      const searchedRecords = await (prisma as any)[modelName].findMany({
        where: {
          OR: searchQueries,
        },
        orderBy,
        skip,
        take: limitNum,
      });

      const totalFound = await (prisma as any)[modelName].findMany({
        where: {
          OR: searchQueries,
        },
      });

      const found = totalFound.length;
      const totalPages = Math.ceil(found / limitNum);

      res.locals.data = searchedRecords;
      res.locals.currentPage = pageNum;
      res.locals.totalPages = totalPages;
      res.locals.found = found;

      return next();
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      res.status(400).json({ success: false, message });
    }
  };
};
