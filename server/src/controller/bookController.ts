import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function addBook(req: Request, res: Response, next: NextFunction) {
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
}
