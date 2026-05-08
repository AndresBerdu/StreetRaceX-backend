import type { Request, Response } from "express";
import { fireOrmChallenge } from "../firebase/fireOrmChallenge.ts";
import type { Challenge } from "../../domain/interfaces/Challenge.js";
import { create_challenge } from "../../application/createChallenge.ts";
import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";
import { fireOrmUserRepository } from "../../../user/infrastructure/firebase/fireOrmUserRepository.ts";

const challengeRepository = fireOrmChallenge();
const userRepository = fireOrmUserRepository();

export const createChallenge = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const challengeData: Challenge = {
      ...data,
      winner: null,
      state: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await create_challenge(
      challengeRepository,
      userRepository,
    )(challengeData);

    handleResponse(res, result);
  } catch (error) {
    // Zod validation error
    if ((error as any)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as any).issues,
      });
    }

    return res.status(500).json({
      ok: false,
      error: (error as Error).message,
    });
  }
};
