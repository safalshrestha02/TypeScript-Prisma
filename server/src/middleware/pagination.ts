import { Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

interface SearchPaginationSortOptions {
  model: Prisma.ModelName;
  searchableFields: Array<keyof User>;
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

        res.locals.data = { allRecords };
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
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
