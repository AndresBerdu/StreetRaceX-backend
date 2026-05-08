import { Router } from "express";

import { ChallengeRepository } from "../firebase/fireOrmChallenge.ts";
import { userFireRepository } from "../../../user/infrastructure/firebase/fireOrmUserRepository.ts";

// use cases (snake_case)
import { create_challenge } from "../../application/createChallenge.ts";
import { accept_challenge } from "../../application/acceptedChallenge.ts";
import { reject_challenge } from "../../application/rejectChallenge.ts";
import { cancel_challenge } from "../../application/cancelChallenge.ts";
import { start_challenge } from "../../application/startChallenge.ts";
import { complete_challenge } from "../../application/completeChallenge.ts";

const router = Router();

// CREATE
router.post("/", async (req, res) => {
  const result = await create_challenge(
    ChallengeRepository,
    userFireRepository as any,
  )(req.body);

  res.status(result.statusCode).json(result);
});

// ACCEPT
router.patch("/:id/accept", async (req, res) => {
  const result = await accept_challenge(ChallengeRepository)(req.params.id);
  res.status(result.statusCode).json(result);
});

// REJECT
router.patch("/:id/reject", async (req, res) => {
  const result = await reject_challenge(ChallengeRepository)(req.params.id);
  res.status(result.statusCode).json(result);
});

// CANCEL
router.patch("/:id/cancel", async (req, res) => {
  const result = await cancel_challenge(ChallengeRepository)(req.params.id);
  res.status(result.statusCode).json(result);
});

// START
router.patch("/:id/start", async (req, res) => {
  const result = await start_challenge(ChallengeRepository)(req.params.id);
  res.status(result.statusCode).json(result);
});

// COMPLETE
router.patch("/:id/complete", async (req, res) => {
  const result = await complete_challenge(ChallengeRepository)(req.params.id);
  res.status(result.statusCode).json(result);
});

export default router;