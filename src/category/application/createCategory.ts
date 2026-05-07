import type { Category } from "../domain/interfaces/Category.ts";
import type { ICategoryRepository } from "../domain/interfaces/ports/CategoryRepository.ts";

import { success, failure, type Result } from "../../main/domain/Result.ts";
import { alreadyExist } from "../../main/domain/AppError.ts";

export const create_category = (categoryRepository: ICategoryRepository) => {
  console.log("CREATE CATEGORY HIT");
  return async (data: Omit<Category, "id">): Promise<Result<Category>> => {

    const categoryExist = await categoryRepository.get_category_by_name(data.name);

    if (categoryExist) return failure(alreadyExist("Category"));

    const newCategory = await categoryRepository.create_category(data);

    return success(201, newCategory, "Category created");
  };
};