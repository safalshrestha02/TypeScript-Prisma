import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";
import { User } from "../model/User.model";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const getAllUser: RequestHandler = async (req, res, next) => {
  try {
    const users = res.locals.data;
    const currentPage = res.locals.currentPage;
    const totalPages = res.locals.totalPages;
    const found = res.locals.found;
    res.json({ users, currentPage, totalPages, found });
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(400).json({ success: false, message });
  }
};

export const register: RequestHandler = async (req, res, next) => {
  const { name, email, password }: User = req.body;

  if (!email) {
    throw new Error("can't be blank");
  }

  if (!password) {
    throw new Error("can't be blank");
  }

  try {
    const alreadyExistUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!alreadyExistUser) {
      throw new Error("Username or password invalid");
    }

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
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(400).json({ success: false, message });
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    if (!user) throw new Error("invalid user");

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new Error("invalid user");

    const signedToken = jwt.sign({ user }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.cookie("jwt", signedToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ loggedIn: user, token: signedToken });
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(400).json({ success: false, message });
  }
};

export const activeUser: RequestHandler = async (req, res, next) => {
  try {
    // const active = prisma.user.findUnique(req.currentUser);
    return res.status(200).json({ success: true, data: req.currentUser });
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(400).json({ success: false, message });
  }
};
