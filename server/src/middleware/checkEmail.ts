import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function registerValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  next();
}
