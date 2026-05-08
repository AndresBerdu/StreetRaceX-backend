import { notFound } from "../../main/domain/AppError.ts";
import type { ICategoryRepository } from "../domain/interfaces/ICategoryRepositoy.js";

export const delete_category_by_id = (repo: ICategoryRepository) => {
  return async (id: string): Promise<void> => {

    const existing = await repo.get_category_by_id(id);

    if (!existing) throw notFound("Category");

    await repo.delete_category_by_id(id);
  };
};