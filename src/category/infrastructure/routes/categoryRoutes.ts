import { Router } from "express";
import { createCategoryController } from "../controllers/categoryController.ts";

export const categoryRoutes = (repo: { findAll?: any; findById?: any; create?: (arg0: any) => any; }) => {
  const router = Router();

  router.post("/", createCategoryController(repo));
  router.get("/", async (req, res) => res.json(await repo.findAll()));
  router.get("/:id", async (req, res) => res.json(await repo.findById(req.params.id)));

  return router;
};