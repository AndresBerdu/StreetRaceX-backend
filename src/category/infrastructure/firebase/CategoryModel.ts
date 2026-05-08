import { Collection } from "fireorm";

@Collection("category")
export class CategoryModel {
  id!: string;
  name!: string;
  description!: string;
  active!: boolean;
  created_at!: Date;
}