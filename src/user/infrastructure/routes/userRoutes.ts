import { Router } from "express";
import {
  createUser,
  deleteUserBySlug,
  getUserBySlug,
  getUsers,
  updateUserBySlug,
  updateUserProfilePhoto,
} from "../controllers/userController.ts";
import {
  createVehicleByUserSlug,
  deleteVehicleByVehicleSlugByUserSlug,
  getVehiclesByUserSlug,
  updateVehicleByVehicleSlugByUserSlug,
} from "../controllers/vehicleController.ts";
import { validateRoleToken } from "../../../auth/infrastructure/middlewares/token/validateRoleTokenMiddleware.ts";
import upload from "../../../main/infrastructure/config/multerConfiguration.ts";
import { uploadErrorHandler } from "../../../main/infrastructure/middlewares/multer/uploadErrorHandleMiddleware.ts";
import { validateSlugAndRoleToken } from "../../../auth/infrastructure/middlewares/token/validateRoleAndSlugTokenMiddleware.ts";
import { validateJsonContentType } from "../../../main/infrastructure/middlewares/multer/validateJsonContetTypeMiddleware.ts";
import { updateUserRankController } from "../controllers/notificationController.ts";

const userRouters: Router = Router();

// User routes
userRouters.get("/", getUsers);
userRouters.post(
  "/",
  upload.single("profile_photo"),
  uploadErrorHandler,
  validateRoleToken,
  createUser,
);

userRouters
  .route("/:slug")
  .get(getUserBySlug)
  .patch(validateJsonContentType, validateSlugAndRoleToken, updateUserBySlug)
  .delete(validateSlugAndRoleToken, deleteUserBySlug);

/* Aditional route for update profile photo */
userRouters
  .route("/:slug/profile_photo")
  .patch(
    upload.single("profile_photo"),
    uploadErrorHandler,
    validateSlugAndRoleToken,
    updateUserProfilePhoto,
  );

// User with vehicles routes
userRouters
  .route("/:slug/vehicles")
  .get(getVehiclesByUserSlug)
  .post(upload.single("photo"), uploadErrorHandler, createVehicleByUserSlug);

userRouters
  .route("/:slug/vehicles/:vehicle_slug")
  .patch(
    upload.single("photo"),
    uploadErrorHandler,
    validateSlugAndRoleToken,
    updateVehicleByVehicleSlugByUserSlug,
  )
  .delete(validateSlugAndRoleToken, deleteVehicleByVehicleSlugByUserSlug);

// User with notification routes
userRouters
  .route("/:slug/rank")
  .put(validateSlugAndRoleToken, updateUserRankController);

export default userRouters;
