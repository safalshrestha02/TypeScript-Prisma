import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies) {
      token = req.cookies;
    }

    if (!token) {
      res.status(401).json({ Message: "no token" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    if (payload) {
      res.locals.user = payload;
      res.locals.user.role = payload;
    }

    next();
  } catch (error) {
    next(error);
  }
};
