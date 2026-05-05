import type { NextFunction, Request, Response } from "express";
import { getPayloadToken } from "../../util/getPayloadToken.ts";

export const validateSlugAndRoleToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { slug } = req.params;
  const { access_token } = req.cookies;

  const payload = getPayloadToken(access_token);

  if (!payload || !(payload.role === "admin" || payload.slug === slug)) {
    return res.status(401).json({
      ok: false,
      message: "user not authorizated",
    });
  }

  next();
};
