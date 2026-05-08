import { Router } from "express";

import {
  acceptChallengeController,
  cancelChallengeController,
  completeChallengeController,
  createChallengeController,
  rejectChallengeController,
  startChallengeController,
} from "../controllers/challengeController.ts";

const router = Router();

// CREATE
router.post("/", createChallengeController);

// ACCEPT
router.patch("/:id/accept", acceptChallengeController);

// REJECT
router.patch("/:id/reject", rejectChallengeController);

// CANCEL
router.patch("/:id/cancel", cancelChallengeController);

// START
router.patch("/:id/start", startChallengeController);

// COMPLETE
router.patch("/:id/complete", completeChallengeController);

export default router;
