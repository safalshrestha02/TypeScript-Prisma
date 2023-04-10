import { Request, Response, NextFunction, RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";
import { User } from "../model/User.model";

import HttpException from "../model/error";

import { ProjectError } from "../utils/error";

const prisma = new PrismaClient();

// type UserOrderByInput = {
//   id?: "asc" | "desc";
//   name?: "asc" | "desc";
// };

const checkUserUniqueness = async (email: string) => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUserByEmail) {
    throw new HttpException({
      errors: {
        ...(existingUserByEmail ? { email: ["has already been taken"] } : {}),
      },
    });
  }
};

export const getAllUser: RequestHandler = async (req, res) => {
  try {
    // const search = req.query.search?.toString() || "";

    // const page = parseInt(req.query.page?.toString() || "1");
    // const limit = parseInt(req.query.limit?.toString() || "10");

    // const skip = (page - 1) * limit;

    // const sortField = req.query.sortField?.toString() || "name";
    // const sortOrder = req.query.sortOrder?.toString() || "asc";

    // const orderBy: UserOrderByInput = {
    //   [sortField]: sortOrder,
    // };

    // const count = await prisma.user.count();

    // const totalPages = Math.ceil(count / limit);
    // const currentPage = page;

    // const allUsers = await prisma.user.findMany({
    //   // skip,
    //   // take: limit,
    //   // orderBy,
    //   // where: {
    //   //   OR: [
    //   //     { name: { contains: search, mode: "insensitive" } },
    //   //     { email: { contains: search, mode: "insensitive" } },
    //   //   ],
    //   // },
    // });
    // res.status(201).json({
    //   allUsers,
    //   // , totalPages, currentPage
    // });
    // const count = await prisma.user.count();

    // const totalPages = Math.ceil(count / limit);
    // const currentPage = page;

    const users = res.locals.data;
    res.json({ users });
  } catch (error) {
    res.status(401).json(
      new ProjectError({
        name: "Request Error",
        message: "You are not logged in",
      })
    );
  }
};

export const getAllBooks: RequestHandler = async (_req, res) => {
  try {
    const allBooks = await prisma.book.findMany();
    res.status(201).json({ allBooks });
  } catch (error) {
    res.status(401).json(
      new ProjectError({
        name: "Request Error",
        message: "You are not logged in",
      })
    );
  }
};

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password }: User = req.body;
  if (!email) {
    throw new HttpException({ errors: { email: ["can't be blank"] } });
  }
  if (!password) {
    throw new HttpException({ errors: { password: ["can't be blank"] } });
  }
  // console.log(req.body);
  try {
    await checkUserUniqueness(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: {
        name: true,
        email: true,
        password: true,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    const comparePassword: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (comparePassword) res.status(201).json({ loggedIn: user });
    else res.status(400).json({ error: "invalid" });
  } catch (error) {
    res.status(401).json(
      new ProjectError({
        name: "Post Error",
        message: "Email or Password is invalid",
      })
    );
  }
};
