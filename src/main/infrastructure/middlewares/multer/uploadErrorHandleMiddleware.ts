import type { NextFunction, Request, Response } from "express";

export const uploadErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Error && err.message.includes("Only can images jpg, jpeg or png")) {
    return res.status(400).json({ ok: false, error: err.message });
  }
  next(err);
};
