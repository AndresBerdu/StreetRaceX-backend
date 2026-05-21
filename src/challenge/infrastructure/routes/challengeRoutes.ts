import { Router } from "express";
import { createChallenge, updateChallengeController } from "../controllers/challengeController.ts";

const challengesRoutes = Router();

/* create challenge */
challengesRoutes.post("/", createChallenge,);

/* update challenge */
challengesRoutes.patch("/:slug", updateChallengeController);


export default challengesRoutes;
