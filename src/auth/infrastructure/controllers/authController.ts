import type { Request, Response } from "express";
import { fireOrmAuthRepository } from "../firebase/fireOrmAuthRepository.ts";
import type { User } from "../../../user/domain/interfaces/User.js";
import { UserShema } from "../../../user/domain/schemas/UserShema.ts";
import { sign_up_session } from "../../application/signUpSession.ts";
import { ZodError } from "zod/v4";

const authRepository = fireOrmAuthRepository();

export const signInSession = (req: Request, res: Response) => {};

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

    const useCase = sign_up_session(authRepository);
    const newUser = await useCase(userData);

    return res.status(201).cookie("access_token").cookie("refresh_token").json({
      ok: true,
      data: newUser,
      message: "new user created",
    });
  } catch (error) {
    if (error instanceof ZodError) {
        res.status(409).json({
            ok: false,
            error: error.issues
        })
    }

    if (error instanceof Error) {
      res.status(500).json({
        ok: false,
        error: error,
      });
    }
  }
};

export const logueOutSession = (req: Request, res: Response) => {};

export const refreshSession = (req: Request, res: Response) => {};
