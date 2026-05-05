import { Router } from "express";
import {
  logueOutSession,
  refreshSession,
  signInSession,
  signUpSession,
} from "../controllers/authController.ts";
import { validateToken } from "../middlewares/token/validateTokenMiddleware.ts";
import { validateRefreshToken } from "../middlewares/token/validateRefreshTokenMiddleware.ts";
import upload from "../../../main/infrastructure/config/multerConfiguration.ts";
import { uploadErrorHandler } from "../../../main/infrastructure/middlewares/multer/uploadErrorHandleMiddleware.ts";

const authRouter: Router = Router();

authRouter.post("/sign-in-session", signInSession);
authRouter.post(
  "/sign-up-session",
  upload.single("profile_photo"),
  uploadErrorHandler,
  signUpSession,
);
authRouter.post("/logue-out-session", validateToken, logueOutSession);
authRouter.post("/refresh-session", validateRefreshToken, refreshSession);

export default authRouter;
