import { success, failure, type Result } from "../../main/domain/Result.ts";
import { notFound } from "../../main/domain/AppError.ts";

import type { Category } from "../domain/interfaces/Category.ts";
import type { ICategoryRepository } from "../domain/interfaces/ports/CategoryRepository.ts";

export const get_category_by_id = (repo: ICategoryRepository) => {
  return async (id: string): Promise<Result<Category>> => {

    const category = await repo.get_category_by_id(id);

    if (!category) return failure(notFound("Category"));

    return success(200, category, "Category obtained");
  };
};