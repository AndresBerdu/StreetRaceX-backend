import type { CompetitionCategory } from "../Category.js";

export interface ICategoryRepository {
  create(data: CompetitionCategory): Promise<CompetitionCategory>;
  findAll(): Promise<CompetitionCategory[]>;
  findById(id: string): Promise<CompetitionCategory | null>;
  update(id: string, data: Partial<CompetitionCategory>): Promise<void>;
  delete(id: string): Promise<void>;
}