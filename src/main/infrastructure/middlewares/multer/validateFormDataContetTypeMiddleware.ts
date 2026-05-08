import type { Request, Response, NextFunction } from "express";

export const validateJsonContentType = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    res.status(415).json({
      ok: false,
      error: "Content-Type must be application/json",
    });
    return;
  }
  next();
};
