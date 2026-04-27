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
  updateVehicleWithOutPlateByUserSlug,
  updateVehicleWithPlateByUserSlug,
} from "../controllers/vehicleController.ts";

const userRouters: Router = Router();

// User routes
userRouters.get("/", getUsers);
userRouters.post("/", createUser);

userRouters
  .route("/:slug")
  .get(getUserBySlug)
  .patch(updateUserBySlug)
  .delete(deleteUserBySlug);

// User with vehicles routes
userRouters
  .route("/:slug/vehicles/")
  .get(getVehiclesByUserSlug)
  .post(createVehicleByUserSlug);

userRouters
  .route("/:slug/vehicles/:plate")
  .patch(updateVehicleWithPlateByUserSlug)
  .patch(updateVehicleWithOutPlateByUserSlug);

export default userRouters;
