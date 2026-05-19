import { success, type Result } from "../../main/domain/Result.ts";
import type { ICategoryRepository } from "../domain/interfaces/ports/ICategoryRepositoy.js";
import type { Category } from "../domain/types/Category.ts";

export const get_categories = (categoryRepository: ICategoryRepository) => {
  return async (): Promise<Result<Category[]>> => {
    const categories = await categoryRepository.get_categories();

    return success(200, categories, "categories obtained");
  };
};
