import type { Request, Response } from "express";

import { create_challenge } from "../../application/createChallenge.ts";
import { accept_challenge } from "../../application/acceptedChallenge.ts";
import { reject_challenge } from "../../application/rejectChallenge.ts";
import { cancel_challenge } from "../../application/cancelChallenge.ts";
import { start_challenge } from "../../application/startChallenge.ts";
import { complete_challenge } from "../../application/completeChallenge.ts";
import { fireOrmChallengeRepository } from "../firebase/fireOrmChallengeRepository.ts";
import { fireOrmUserRepository } from "../../../user/infrastructure/adapters/firebase/fireOrmUserRepository.ts";

const challengeFireoRepository = fireOrmChallengeRepository();
const userFireRepository = fireOrmUserRepository();

// CREATE
export const createChallengeController = async (
  req: Request,
  res: Response,
) => {
  const result = await create_challenge(
    challengeFireoRepository,
    userFireRepository as any,
  )(req.body);
  res.status(result.statusCode).json(result);
};

// ACCEPT
export const acceptChallengeController = async (
  req: Request,
  res: Response,
) => {
  const result = await accept_challenge(challengeFireoRepository)(
    (req.params as any).id,
  );
  res.status(result.statusCode).json(result);
};

// REJECT
export const rejectChallengeController = async (
  req: Request,
  res: Response,
) => {
  const result = await reject_challenge(challengeFireoRepository)(
    (req.params as any).id,
  );
  res.status(result.statusCode).json(result);
};

// CANCEL
export const cancelChallengeController = async (
  req: Request,
  res: Response,
) => {
  const result = await cancel_challenge(challengeFireoRepository)(
    (req.params as any).id,
  );
  res.status(result.statusCode).json(result);
};

// START
export const startChallengeController = async (req: Request, res: Response) => {
  const result = await start_challenge(challengeFireoRepository)(
    (req.params as any).id,
  );
  res.status(result.statusCode).json(result);
};

// COMPLETE
export const completeChallengeController = async (
  req: Request,
  res: Response,
) => {
  const result = await complete_challenge(challengeFireoRepository)(
    (req.params as any).id,
  );
  res.status(result.statusCode).json(result);
};
