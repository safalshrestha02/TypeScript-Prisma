import { Request, Response, NextFunction, RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { User } from "../model/User.model";

import HttpException from "../model/error";

import { ProjectError } from "../utils/error";

const prisma = new PrismaClient();

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
    next();
  } catch (error) {
    res.status(401).json(
      new ProjectError({
        name: "Post Error",
        message: "Email or Password is invalid",
      })
    );
  }
};
