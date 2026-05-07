import type { Request, Response } from "express";

import { create_category } from "../../application/createCategory.ts";
import { get_categories } from "../../application/getCategory.ts";
import { get_category_by_id } from "../../application/getCategoryById.ts";
import { update_category_by_id } from "../../application/updatedCategoryById.ts";
import { delete_category_by_id } from "../../application/deleteCategoryById.ts";
import {createCategorySchema, updateCategorySchema} from "../../domain/schemas/CategoryRepository.ts";

import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";

import { fireOrmCategoryRepository } from "../firebase/fireOrmCategoryRepository.ts";

/* Repository */
const categoryRepository = fireOrmCategoryRepository();


// 🔥 GET ALL
export const getCategories = async (req: Request, res: Response) => {
  try {
    const useCase = get_categories(categoryRepository);

    const categories = await useCase();

    return res.status(200).json({
      ok: true,
      data: categories,
      message: "Categories obtained",
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: (error as Error).message,
    });
  }
};


// 🔥 GET BY ID
export const getCategoryById = async (req: Request, res: Response) => {
  const result = await get_category_by_id(categoryRepository)(
    req.params.id as string
  );

  handleResponse(res, result);
};


// 🔥 CREATE
export const createCategory = async (req: Request, res: Response) => {
  try {
    const data = createCategorySchema.parse(req.body);

    const categoryData = {
      ...data,
      description: data.description ?? "",
      active: true,
      created_at: new Date()
    };

    const result = await create_category(categoryRepository)(categoryData);

    handleResponse(res, result);

  } catch (error) {

    // Zod validation error
    if ((error as any)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as any).issues,
      });
    }

    return res.status(500).json({
      ok: false,
      error: (error as Error).message,
    });
  }
};


// 🔥 UPDATE
export const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const data = updateCategorySchema.parse(req.body);

    const result = await update_category_by_id(categoryRepository)(id, data);

    handleResponse(res, result);

  } catch (error) {

    if ((error as any)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as any).issues,
      });
    }

    return res.status(500).json({
      ok: false,
      error: (error as Error).message,
    });
  }
};


// 🔥 DELETE
export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const useCase = delete_category_by_id(categoryRepository);

    await useCase(id);

    return res.status(204).end();

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: (error as Error).message,
    });
  }
};