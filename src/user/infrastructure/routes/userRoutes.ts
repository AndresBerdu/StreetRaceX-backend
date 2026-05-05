import { Router } from "express";
import {
  createUser,
  deleteUserBySlug,
  getUserBySlug,
  getUsers,
  updateUserBySlug,
} from "../controllers/userController.ts";
import {
  createVehicleByUserSlug,
  getVehiclesByUserSlug,
  updateVehicleWithPlateByUserSlug,
  updateVehicleWithSlugByUserSlug,
} from "../controllers/vehicleController.ts";
import { validateRoleToken } from "../../../auth/infrastructure/middlewares/token/validateRoleTokenMiddleware.ts";
import upload from "../../../main/infrastructure/config/multerConfiguration.ts";
import { uploadErrorHandler } from "../../../main/infrastructure/middlewares/multer/uploadErrorHandleMiddleware.ts";
import { validateSlugAndRoleToken } from "../../../auth/infrastructure/middlewares/token/validateRoleAndSlugTokenMiddleware.ts";

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
  .patch(
    upload.single("profile_photo"),
    validateSlugAndRoleToken,
    updateUserBySlug,
  )
  .delete(validateSlugAndRoleToken, deleteUserBySlug);

// User with vehicles routes
userRouters
  .route("/:slug/vehicles/")
  .get(getVehiclesByUserSlug)
  .post(upload.single("photo"), createVehicleByUserSlug);

userRouters
  .route("/:slug/vehicles/plate/:plate")
  .patch(updateVehicleWithPlateByUserSlug);

userRouters
  .route("/:slug/vehicles/slug/:vehicle_slug")
  .patch(upload.single("photo"), updateVehicleWithSlugByUserSlug);

export default userRouters;
