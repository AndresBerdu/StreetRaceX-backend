import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    res.status(401).json({
      ok: false,
      error: "user not authorizated",
    });
  }

  try {
    jwt.verify(refreshToken, process.env.SECRET_KEY!);
    next();
  } catch (error) {
    res.status(401).json({
      ok: false,
      error: "user not authorizated, token invalid or expired",
    });
  }
};
