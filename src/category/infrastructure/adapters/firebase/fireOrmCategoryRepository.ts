import { v4 as uuidv4 } from "uuid";
import { CategoryModel } from "./CategoryModel.ts";
import { getRepository } from "fireorm";
import type { ICategoryRepository } from "../../../domain/interfaces/ports/ICategoryRepositoy.js";
import type { Category } from "../../../domain/types/Category.ts";

const categoryRepository = getRepository(CategoryModel);

export const fireOrmCategoryRepository = (): ICategoryRepository => {
  return {
    async create_category(data: Category): Promise<Category> {
      const categoryModel = new CategoryModel();

      Object.assign(categoryModel, data);

      categoryModel.id = uuidv4();

      return await categoryRepository.create(categoryModel);
    },

    async get_categories(): Promise<Category[]> {
      return await categoryRepository.find();
    },

    async get_category_by_name(name: string): Promise<Category | null> {
      const category = await categoryRepository
        .whereEqualTo("name", name)
        .findOne();

      return category!;
    },

    async get_category_by_slug(slug: string): Promise<Category | null> {
      const category = await categoryRepository
        .whereEqualTo("slug", slug)
        .findOne();

      return category!;
    },

    async update_category_by_slug(
      slug: string,
      data: Partial<Category>,
    ): Promise<Category> {
      const category = await categoryRepository
        .whereEqualTo("slug", slug)
        .findOne();

      Object.assign(category!, data);

      return await categoryRepository.update(category!);
    },

    async delete_category_by_slug(slug: string): Promise<void> {
      const category = await categoryRepository
        .whereEqualTo("slug", slug)
        .findOne();

      await categoryRepository.delete(category!.id);
    },
  };
};
