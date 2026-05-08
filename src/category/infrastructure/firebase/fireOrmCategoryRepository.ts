import type { Category } from "../../domain/interfaces/Category.js";
import type { ICategoryRepository } from "../../domain/interfaces/ports/CategoryRepository.ts";

import { v4 as uuidv4 } from "uuid";
import { CategoryModel } from "./CategoryModel.ts";
import { getRepository } from "fireorm";

const categoryRepository = getRepository(CategoryModel);

/* Simulación Firestore (ajústalo a tu ORM real si ya usas FireORM) */
const collection = new Map<string, Category>();

export const fireOrmCategoryRepository = (): ICategoryRepository => {
  return {
    async create_category(data: Category): Promise<Category> {
      const categoryModel = new CategoryModel();

      Object.assign(categoryModel, data);

      categoryModel.id = uuidv4();

      return await categoryRepository.create(categoryModel);
    },

    async get_categories(): Promise<Category[]> {
      return Array.from(collection.values());
    },

    async get_category_by_id(id: string): Promise<Category | null> {
      return collection.get(id) || null;
    },

    async get_category_by_name(name: string): Promise<Category | null> {
      const categories = Array.from(collection.values());

      return categories.find((c) => c.name === name) || null;
    },

    async update_category_by_id(
      id: string,
      data: Partial<Category>,
    ): Promise<Category> {
      const existing = collection.get(id);

      if (!existing) throw new Error("Category not found");

      const updated = {
        ...existing,
        ...data,
      };

      collection.set(id, updated);

      return updated;
    },

    async delete_category_by_id(id: string): Promise<void> {
      collection.delete(id);
    },
  };
};
