import { Router } from "express";
import {
  createUser,
  deleteUserById,
  getUserById,
  getUserByUsername,
  getUsers,
  updateUserById,
} from "../controllers/userController.ts";

const userRouters: Router = Router();

userRouters.get("/", getUsers);
userRouters.post("/", createUser);

userRouters
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

  userRouters
  .route("/:username")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

export default userRouters;
