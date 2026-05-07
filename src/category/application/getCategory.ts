import type { ICategoryRepository } from "../domain/interfaces/ports/CategoryRepository.ts";

export const get_categories = (categoryRepository: ICategoryRepository) => {
  return async () => {
    return await categoryRepository.get_categories();
  };
};