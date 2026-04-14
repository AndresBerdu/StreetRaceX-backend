import { Router } from "express";
import { signUpSession } from "../controllers/authController.ts";

const authRouter: Router = Router();

authRouter.post("/sign-up-session", signUpSession);

export default authRouter;
