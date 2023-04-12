import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addBook: RequestHandler = async (req, res, next) => {
  const { title, body } = req.body;
  const { id } = req.params;
  try {
    const book = await prisma.book.create({
      data: {
        title,
        body,
        userId: id,
      },
    });
    res.status(201).json({ book });
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(400).json({ success: false, message });
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
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(400).json({ success: false, message });
  }
};
