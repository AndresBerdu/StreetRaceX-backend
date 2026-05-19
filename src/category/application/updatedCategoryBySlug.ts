import { success, failure, type Result } from "../../main/domain/Result.ts";
import { notFound } from "../../main/domain/AppError.ts";

import type { ICategoryRepository } from "../domain/interfaces/ports/ICategoryRepositoy.js";
import type { UpdateCategory } from "../domain/schemas/updateCategorySchema.ts";
import type { Category } from "../domain/types/Category.ts";

export const update_category_by_slug = (
  categoryRepository: ICategoryRepository,
) => {
  return async (
    slug: string,
    data: UpdateCategory,
  ): Promise<Result<Category>> => {
    const categoryExisting =
      await categoryRepository.get_category_by_slug(slug);

    if (!categoryExisting) return failure(notFound("Category"));

    const updated = await categoryRepository.update_category_by_slug(
      slug,
      data,
    );

    return success(200, updated, "Category updated");
  };
};
