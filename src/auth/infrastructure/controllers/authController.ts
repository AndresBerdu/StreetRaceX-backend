import type { Request, Response } from "express";
import { fireOrmAuthRepository } from "../firebase/fireOrmAuthRepository.ts";
import type { User } from "../../../user/domain/interfaces/User.js";
import { UserShema } from "../../../user/domain/schemas/UserShema.ts";
import { sign_up_session } from "../../application/signUpSession.ts";
import { ZodError } from "zod/v4";
import { generateRefreshToken, generateToken } from "../util/createToken.ts";
import { fireoUserRepository } from "../../../user/infrastructure/firebase/fireOrmUserRepository.ts";
import { sign_in_session } from "../../application/signInSession.ts";
import { comparatePassword } from "../../../main/infrastructure/security/comparatePassword.ts";

const authRepository = fireOrmAuthRepository();
const userRepository = fireoUserRepository();

export const signInSession = async (req: Request, res: Response) => {
  try {
    const userCredentials = req.body;

    const useCase = sign_in_session(authRepository);
    const user = await useCase(userCredentials);

    const token = generateToken(userCredentials);
    const refreshToken = generateRefreshToken(userCredentials);

    const arePasswordEquals = await comparatePassword(
      userCredentials.password,
      user?.password!,
    );

    if (!arePasswordEquals) {
      res.status(409).json({
        ok: false,
        error: "the passwords aren't equeals",
      });
    }
    return res
      .status(200)
      .cookie("access_token", token, { maxAge: 1000 * 60 * 60 })
      .cookie("refresh_token", refreshToken, { maxAge: 1000 * 60 * 60 * 24 })
      .json({
        ok: true,
        data: [user],
        message: "sign in success",
      });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const signUpSession = async (req: Request, res: Response) => {
  try {
    const parserd = UserShema.parse(req.body);

    const userData: User = {
      ...parserd,
      rank: "D",
      victories: 0,
      defeats: 0,
      consecutive_victories: 0,
      state: "active",
      updated_at: new Date(),
      created_at: new Date(),
    };

    const useCase = sign_up_session(authRepository, userRepository);
    const newUser = await useCase(userData);

    const token = generateToken(parserd);
    const refreshToken = generateRefreshToken(parserd);

    return res
      .status(201)
      .cookie("access_token", token, { maxAge: 1000 * 60 * 60 })
      .cookie("refresh_token", refreshToken, { maxAge: 1000 * 60 * 60 * 24 })
      .json({
        ok: true,
        data: newUser,
        message: "new user created",
      });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(409).json({
        ok: false,
        error: error.issues,
      });
    }

    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const logueOutSession = (req: Request, res: Response) => {
  try {
    return res
      .status(204)
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .end();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const refreshSession = (req: Request, res: Response) => {
  try {
    const userCredentials = req.body;

    const token = generateToken(userCredentials);
    const refreshToken = generateRefreshToken(userCredentials);

    res
      .status(201)
      .cookie("access_token", token, { maxAge: 1000 * 60 * 60 })
      .cookie("refresh_token", refreshToken, { maxAge: 1000 * 60 * 60 * 24 })
      .json({
        ok: true,
        data: [],
        message: "new user token and refresh token created",
      });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};
