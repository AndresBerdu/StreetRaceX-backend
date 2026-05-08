import { success, failure, type Result } from "../../main/domain/Result.ts";
import { notFound } from "../../main/domain/AppError.ts";

import type { Category } from "../domain/interfaces/Category.ts";
import type { ICategoryRepository } from "../domain/interfaces/ICategoryRepositoy.js";

export const update_category_by_id = (repo: ICategoryRepository) => {
  return async (id: string, data: Partial<Category>): Promise<Result<Category>> => {

    const existing = await repo.get_category_by_id(id);

    if (!existing) return failure(notFound("Category"));

    const updated = await repo.update_category_by_id(id, data);

    return success(200, updated, "Category updated");
  };
};