import { Router } from "express";
import {createCategory, deleteCategoryById, getCategories, getCategoryById, updateCategoryById,} from "../controllers/categoryController.ts";

import { validateRoleToken } from "../../../auth/infrastructure/middlewares/token/validateRoleTokenMiddleware.ts";

const categoryRouters: Router = Router();

categoryRouters.get("/", getCategories);

categoryRouters.post(
  "/",
  validateRoleToken,
  createCategory
);

categoryRouters
  .route("/:id")
  .get(getCategoryById)
  .patch(validateRoleToken, updateCategoryById)
  .delete(validateRoleToken, deleteCategoryById);


export default categoryRouters;