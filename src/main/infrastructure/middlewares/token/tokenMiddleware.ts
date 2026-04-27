import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accesToken = req.cookies.access_token;

  // Status 401 si el usuario no tiene el token en las cookies
  if (!accesToken) {
    return res.status(401).json({
      ok: false,
      error: "usuario no autorizado",
    });
  }

  // Status 401 Verificamos que si el token no esta expirado o es incorrecto
  try {
    jwt.verify(accesToken as string, process.env.SECRET_KEY!);
    next();
  } catch (error) {
    res.status(401).json({
      ok: false,
      error: "usuario no autorizado, token expirado o incorrecto",
    });
  }
};
