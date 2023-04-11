import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addBook: RequestHandler = async (req, res, next) => {
  const { title, body, userId } = req.body;
  try {
    const book = await prisma.book.create({
      data: {
        title,
        body,
        userId,
      },
    });
    res.status(201).json({ book });
  } catch (error) {
    res.status(201).json(error);
  }
};

export const getAllBooks: RequestHandler = async (_req, res, next) => {
  try {
    const books = res.locals.data;
    const currentPage = res.locals.currentPage;
    const totalPages = res.locals.totalPages;
    const found = res.locals.found;
    res.json({ books, currentPage, totalPages, found });
  } catch (error) {
    next(error);
  }
};
