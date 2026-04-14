import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({
      ok: false,
      error: "user not authorizated",
    });
  }

  try {
    jwt.verify(accessToken as string, process.env.SECRET_KEY!);
    next();
  } catch (error) {
    res.status(401).json({
      ok: false,
      error: "user not authorizated, token invalid or expired",
    });
  }
};
