import { Router } from "express";
import {createCategory, deleteCategoryById, getCategories, getCategoryById, updateCategoryById,} from "../controllers/categoryController.ts";

import { validateRoleToken } from "../../../auth/infrastructure/middlewares/token/validateRoleTokenMiddleware.ts";

const categoryRouters: Router = Router();

//Get all categories
categoryRouters.get("/", getCategories);

// Create category
categoryRouters.post(
  "/",
  validateRoleToken,
  createCategory
);

// Routes with ID
categoryRouters
  .route("/:id")
  .get(getCategoryById)
  .patch(validateRoleToken, updateCategoryById)
  .delete(validateRoleToken, deleteCategoryById);


export default categoryRouters;