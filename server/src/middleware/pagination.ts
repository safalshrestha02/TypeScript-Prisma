import { Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

interface SearchPaginationSortOptions {
  model: Prisma.ModelName;
  searchableFields: Array<keyof User>;
}

// interface SearchPaginationSortOptions {
//   model: "user" | "post";
//   searchableFields: Array<keyof User>;
// }

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

// interface Model {
//   model: "user" | "post";
// }

// interface SearchableFields {
//   searchableFields: Array<keyof User>;
// }

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

      // const count = await prisma.user.count();

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      const orderBy: UserOrderByInput = { [sort]: order };

      const lowercase = model.toLowerCase();

      // console.log(totalPages);

      if (!search) {
        const count = await prisma.user.count();

        const totalPages = Math.ceil(count / limitNum);
        const currentPage = pageNum;

        const allRecords = await (prisma as any)[lowercase].findMany({
          orderBy,
          skip,
          take: limitNum,
        });

        res.locals.data = { allRecords, totalPages, currentPage };
        return next();
      }

      const searchQueries = searchableFields.map((field) => ({
        [field]: { contains: search, mode: "insensitive" },
      }));

      const searchedRecords = await (prisma as any)[lowercase].findMany({
        where: {
          OR: searchQueries,
        },
        orderBy,
        skip,
        take: limitNum,
      });

      const found = searchedRecords.length;

      const count = await prisma.user.count();

      //   const totalPages = Math.ceil(count / limitNum);
      //   const currentPage = pageNum;

      res.locals.data = {
        searchedRecords,
        found: found,
        totalPages: count,
        currentPage: pageNum,
      };
      return next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
