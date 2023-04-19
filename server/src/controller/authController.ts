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
  try {
    const { name, email, password, role }: User = req.body;

    if (!email || !password) {
      throw new Error("can't be blank");
    }

    const checkUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkUser) {
      throw new Error("User exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ success: false, message: "email already exists" });
    // next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    if (!user) throw new Error("invalid user");

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new Error("invalid user");

    const signedToken = jwt.sign(user, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(201).json({ loggedIn: user, token: signedToken });
  } catch (error) {
    next(error);
  }
};

export const activeUser: RequestHandler = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, data: res.locals.user });
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    res.status(400).json({ success: false, message });
  }
};
