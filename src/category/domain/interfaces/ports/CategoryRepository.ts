import type { Category } from "../Category.js";

export interface ICategoryRepository {
  create_category(data: Category): Promise<Category>;
  get_categories(): Promise<Category[]>;
  get_category_by_id(id: string): Promise<Category | null>;
  get_category_by_name(name: string): Promise<Category | null>;
  update_category_by_id(id: string, data: Partial<Category>): Promise<Category>;
  delete_category_by_id(id: string): Promise<void>;
}