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
import { validateSlugToken } from "../middlewares/token/validateSlugTokenMiddleware.ts";

const authRouter: Router = Router();

authRouter.post("/sign-in-session", signInSession);
authRouter.post(
  "/sign-up-session",
  upload.single("profile_photo"),
  uploadErrorHandler,
  signUpSession,
);
authRouter.post(
  "/logue-out-session",
  validateToken,
  validateSlugToken,
  logueOutSession,
);
authRouter.post(
  "/refresh-session",
  validateRefreshToken,
  validateSlugToken,
  refreshSession,
);

export default authRouter;
