import type { Request, Response } from "express";
import { fireOrmAuthRepository } from "../adapters/fireOrmAuthRepository.ts";
import { fireOrmUserRepository } from "../../../user/infrastructure/firebase/fireOrmUserRepository.ts";
import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";
import { uploadImage } from "../../../main/infrastructure/utils/uploadImage.ts";
import { encryptPassword } from "../../../main/infrastructure/security/encryptPassword.ts";
import { sign_up_session } from "../../application/signUpSession.ts";
import { sign_in_session } from "../../application/signInSession.ts";
import { logue_out_session } from "../../application/logueOutSession.ts";
import { refresh_session } from "../../application/refreshSession.ts";
import { generateRefreshToken, generateToken } from "../util/createToken.ts";
import { generateSlug } from "../../../main/infrastructure/utils/generateSlug.ts";
import { UserShema } from "../../../user/domain/schemas/UserShema.ts";
import type { User } from "../../../user/domain/interfaces/User.ts";
import { redisAuthRepository } from "../adapters/redisAuthRepository.ts";
import type { ZodError } from "zod/v4";

/* Repositories from fire ORM */
const authFireRepository = fireOrmAuthRepository();
const authRedisRepository = redisAuthRepository();
const userFireRepository = fireOrmUserRepository();

/* Controller for Login */
export const signInSession = async (req: Request, res: Response) => {
  try {
    const { username, email, password, profile_photo, locality } = req.body;

    const userCredentials = {
      username,
      email,
      password,
      profile_photo,
      locality,
    };

    const result = await sign_in_session(
      authFireRepository,
      userFireRepository,
    )(userCredentials);

    let slug = "";
    let role = "";

    if (result.ok) {
      slug = result.data.slug;
      role = result.data.role;
    }

    const token = generateToken({ slug, username, email, locality, role });
    const refreshToken = generateRefreshToken({ slug, username, role });

    res
      .cookie("access_token", token, { maxAge: 1000 * 60 * 60 })
      .cookie("refresh_token", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

    handleResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

/* Controller for register a new user */
export const signUpSession = async (req: Request, res: Response) => {
  try {
    /* Fistly the object locality is convert to object */
    req.body.locality = JSON.parse(req.body.locality);

    const { username, password, email, locality } = UserShema.parse(req.body);

    const userData: User = {
      username,
      password: await encryptPassword(password),
      email,
      locality,
      profile_photo: null,
      public_id_photo: null,
      slug: generateSlug("user"),
      rank: "D",
      role: "racer",
      victories: 0,
      defeats: 0,
      consecutive_victories: 0,
      state: "active",
      updated_at: new Date(),
      created_at: new Date(),
    };

    const result = await sign_up_session(
      authFireRepository,
      userFireRepository,
    )(userData);

    /* Validation for upload the image to cloudinary  */
    if (result.ok && req.file) {
      const imageUrl = await uploadImage(req, "users/profile_photos");

      await userFireRepository.update_user_by_slug(result.data.slug, {
        profile_photo: imageUrl?.imageUrl,
        public_id_photo: imageUrl?.publicId,
      });

      result.data.profile_photo = imageUrl?.imageUrl ?? null;
      result.data.public_id_photo = imageUrl?.publicId ?? null;
    }

    /* Cration of tokens with role */
    const token = generateToken({
      username,
      email,
      locality,
      role: "racer",
      slug: userData.slug,
    });
    const refreshToken = generateRefreshToken({
      slug: userData.slug,
      username,
      role: "racer",
    });

    res
      .cookie("access_token", token, { maxAge: 1000 * 60 * 60 })
      .cookie("refresh_token", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

    handleResponse(res, result);
  } catch (error) {
    if ((error as ZodError)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as ZodError).issues.map((issue) => {
          return issue.message;
        }),
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

/* Controller for logue out session */
export const logueOutSession = async (req: Request, res: Response) => {
  try {
    const { access_token, refresh_token } = req.cookies;

    const result = await logue_out_session(authRedisRepository)(
      access_token,
      refresh_token,
    );

    res.clearCookie("access_token").clearCookie("refresh_token");

    handleResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

/* Controller for refresh token */
export const refreshSession = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.cookies;
    const userCredentials = req.body;

    const token = generateToken(userCredentials);
    const refreshToken = generateRefreshToken(userCredentials);

    const result = await refresh_session(authRedisRepository)(refresh_token);

    res
      .cookie("access_token", token, { maxAge: 1000 * 60 * 60 })
      .cookie("refresh_token", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

    handleResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};
