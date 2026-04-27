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
      error: "el usuario no esta autirozado, inicie sección nuevamente",
    });
  }

  const token = jwt.verify(refreshToken as string, process.env.SECRET_KEY!);

  if (!token) {
    res.status(401).json({
      ok: false,
      error: "usuario no autorizado, token expirado o incorrecto",
    });
  }

  next();
};
