import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// import { Prisma } from "../../../node_modules/.prisma/client/index";

const prisma = new PrismaClient();

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ user });
  } catch (error) {
    res.status(201).json(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "user does not exists" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "incorrect credentials" });
    }
    res.status(201).json({ message: "Logged in", user: user });
  } catch (error) {
    res.status(201).json(error);
  }
}
