import type { Category } from "../../types/Category.ts";

export interface ICategoryRepository {
  get_categories(): Promise<Category[]>;
  get_category_by_slug(slug: string): Promise<Category | null>;
  get_category_by_name(name: string): Promise<Category | null>;
  create_category(data: Category): Promise<Category>;
  update_category_by_slug(
    slug: string,
    data: Partial<Category>,
  ): Promise<Category>;
  delete_category_by_slug(slug: string): Promise<void>;
}
