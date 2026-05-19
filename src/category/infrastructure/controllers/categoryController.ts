import type { Request, Response } from "express";
import { create_category } from "../../application/createCategory.ts";
import { get_categories } from "../../application/getCategory.ts";
import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";
import { fireOrmCategoryRepository } from "../adapters/firebase/fireOrmCategoryRepository.ts";
import { get_category_by_slug } from "../../application/getCategoryBySlug.ts";
import { categorySchema } from "../../domain/schemas/categoryShema.ts";
import type { Category } from "../../domain/types/Category.ts";
import { updateCategorySchema } from "../../domain/schemas/updateCategorySchema.ts";
import { update_category_by_slug } from "../../application/updatedCategoryBySlug.ts";
import { delete_category_by_slug } from "../../application/deleteCategoryBySlug.ts";
import { generateSlug } from "../../../main/infrastructure/utils/generateSlug.ts";

/* Repository */
const categoryRepository = fireOrmCategoryRepository();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await get_categories(categoryRepository)();

    return handleResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    const result = await get_category_by_slug(categoryRepository)(slug);

    return handleResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const data = categorySchema.parse(req.body);

    const categoryData: Category = {
      ...data,
      slug: generateSlug("category"),
      description: data.description ?? "",
      active: true,
      created_at: new Date(),
    };

    const result = await create_category(categoryRepository)(categoryData);

    return handleResponse(res, result);
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

export const updateCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    const data = updateCategorySchema.parse(req.body);

    const result = await update_category_by_slug(categoryRepository)(
      slug,
      data,
    );

    return handleResponse(res, result);
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
export const deleteCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    const result = await delete_category_by_slug(categoryRepository)(slug);

    return handleResponse(res, result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: (error as Error).message,
      });
    }
  }
};
