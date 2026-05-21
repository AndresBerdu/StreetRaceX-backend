import { Router } from "express";
import {
  createCategory,
  deleteCategoryBySlug,
  getCategories,
  getCategoryBySlug,
  updateCategoryBySlug,
} from "../controllers/categoryController.ts";

import { validateRoleToken } from "../../../auth/infrastructure/middlewares/token/validateRoleTokenMiddleware.ts";

const categoryRouters: Router = Router();

categoryRouters.get("/", getCategories);

categoryRouters.post("/", validateRoleToken, createCategory);

categoryRouters
  .route("/:slug")
  .get(getCategoryBySlug)
  .patch(validateRoleToken, updateCategoryBySlug)
  .delete(validateRoleToken, deleteCategoryBySlug);

export default categoryRouters;
