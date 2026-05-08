import type { ICategoryRepository } from "../domain/interfaces/ICategoryRepositoy.js";

export const get_categories = (categoryRepository: ICategoryRepository) => {
  return async () => {
    return await categoryRepository.get_categories();
  };
};