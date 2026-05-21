import type { Request, Response } from "express";

import { create_challenge } from "../../application/createChallenge.ts";
import { fireOrmChallengeRepository } from "../ports/firebase/fireOrmChallengeRepository.ts";
import { fireOrmUserRepository } from "../../../user/infrastructure/adapters/firebase/fireOrmUserRepository.ts";
import { generateSlug } from "../../../main/infrastructure/utils/generateSlug.ts";
import {
  ChallengeStatus,
  type Challenge,
} from "../../domain/types/Challenge.ts";
import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";
import { update_challenge } from "../../application/updateChallenge.ts";
import type { updateChallenge } from "../../domain/schemas/UpdateShema.ts";
import type { ZodError } from "zod/v4";

const challengeFireoRepository = fireOrmChallengeRepository();
const userFireRepository = fireOrmUserRepository();

export const createChallenge = async (req: Request, res: Response) => {
  try {
    const {
      challenger_slug,
      challenged_slug,
      type_race,
      vehicle_challenger_slug,
      vehicle_challenged_slug,
      locality_rece,
      date_race,
      notes,
    } = req.body;

    const dateArray = date_race.split("/");
    const date = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);

    const challenge: Challenge = {
      slug: generateSlug("challenge"),
      challenger_slug,
      challenged_slug,
      type_race,
      vehicle_challenger_slug,
      vehicle_challenged_slug,
      locality_rece,
      date_race: date,
      notes,
      status: ChallengeStatus.CREATED,
      winner_slug: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await create_challenge(
      challengeFireoRepository,
      userFireRepository,
    )(challenge);

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
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  }
};

// ACCEPT
export const updateChallengeController = async (
  req: Request,
  res: Response,
) => {
  try {
    const slug = req.params.slug as string;
    const data = req.body as updateChallenge;

    const result = await update_challenge(challengeFireoRepository)(slug, data);

    return handleResponse(res, result);
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
      res.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  }
};
