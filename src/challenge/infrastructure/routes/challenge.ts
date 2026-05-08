import { Router } from "express";

import {
  acceptChallengeController,
  cancelChallengeController,
  completeChallengeController,
  createChallengeController,
  rejectChallengeController,
  startChallengeController,
} from "../controllers/challengeController.ts";

const challengesRoutes = Router();

// CREATE
challengesRoutes.post("/", createChallengeController);

// ACCEPT
challengesRoutes.patch("/:id/accept", acceptChallengeController);

// REJECT
challengesRoutes.patch("/:id/reject", rejectChallengeController);

// CANCEL
challengesRoutes.patch("/:id/cancel", cancelChallengeController);

// START
challengesRoutes.patch("/:id/start", startChallengeController);

// COMPLETE
challengesRoutes.patch("/:id/complete", completeChallengeController);

export default challengesRoutes;
