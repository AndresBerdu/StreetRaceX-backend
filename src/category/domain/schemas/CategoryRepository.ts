import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  active: z.boolean().optional()
});