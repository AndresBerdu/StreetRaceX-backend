import { success, failure, type Result } from "../../main/domain/Result.ts";
import { notFound } from "../../main/domain/AppError.ts";
import type { ICategoryRepository } from "../domain/interfaces/ports/ICategoryRepositoy.js";
import type { Category } from "../domain/types/Category.ts";

export const get_category_by_slug = (categoryRepository: ICategoryRepository) => {
  return async (slug: string): Promise<Result<Category>> => {
    const category = await categoryRepository.get_category_by_slug(slug);

    if (!category) return failure(notFound("Category"));

    return success(200, category, "Category obtained");
  };
};
