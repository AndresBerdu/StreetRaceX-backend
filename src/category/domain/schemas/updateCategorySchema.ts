import { z } from "zod";

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  active: z.boolean().optional()
});

export type UpdateCategory = z.infer<typeof updateCategorySchema>;