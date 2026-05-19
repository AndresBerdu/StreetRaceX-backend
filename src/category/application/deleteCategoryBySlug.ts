import { notFound } from "../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../main/domain/Result.ts";
import type { ICategoryRepository } from "../domain/interfaces/ports/ICategoryRepositoy.js";

export const delete_category_by_slug = (
  categoryRepository: ICategoryRepository,
) => {
  return async (slug: string): Promise<Result<string>> => {
    const categoryExist = await categoryRepository.get_category_by_slug(slug);

    if (!categoryExist) return failure(notFound("Category"));

    await categoryRepository.delete_category_by_slug(slug);
    return success(204, "", "");
  };
};
