import type { NextFunction, Request, Response } from "express";
import { getPayloadToken } from "../../util/getPayloadToken.ts";
import { get_user_by_slug } from "../../../../user/application/user/getUserBySlug.ts";
import { fireOrmUserRepository } from "../../../../user/infrastructure/firebase/fireOrmUserRepository.ts";

const userRepository = fireOrmUserRepository();

export const validateSlugToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  const accessTokenPayload = getPayloadToken(accessToken);
  const refreshTokenPayload = getPayloadToken(refreshToken);

  if (!accessTokenPayload || !refreshTokenPayload) {
    return res.status(401).json({
      ok: false,
      error: "Invalid tokens",
    });
  }

  if (accessTokenPayload.slug !== refreshTokenPayload.slug) {
    return res.status(401).json({
      ok: false,
      error: "Your payload is different",
    });
  }

  next();
};
