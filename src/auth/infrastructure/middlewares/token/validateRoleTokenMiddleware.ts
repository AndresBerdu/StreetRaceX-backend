import type { NextFunction, Request, Response } from "express";
import { getPayloadToken } from "../../util/getPayloadToken.ts";

export const validateRoleToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.access_token;

  const payload = getPayloadToken(token);

  const role = (payload as any).role;

  if (role !== "admin") {
    return res.status(403).json({
      ok: false,
      error: "You cannot create users if you aren't an admin",
    });
  }

  next();
};
