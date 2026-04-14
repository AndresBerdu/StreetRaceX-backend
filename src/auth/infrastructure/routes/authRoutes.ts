import { Router } from "express";
import {
  logueOutSession,
  refreshSession,
  signInSession,
  signUpSession,
} from "../controllers/authController.ts";
import { validateToken } from "../middlewares/token/validateTokenMiddleware.ts";
import { validateRefreshToken } from "../middlewares/token/refreshTokenMiddleware.ts";

const authRouter: Router = Router();

authRouter.post("/sign-in-session", signInSession);
authRouter.post("/sign-up-session", signUpSession);
authRouter.post("/logue-out-session", validateToken, logueOutSession);
authRouter.post("/refresh-session", validateRefreshToken, refreshSession);

export default authRouter;
