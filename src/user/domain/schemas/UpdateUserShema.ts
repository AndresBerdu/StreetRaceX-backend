import z from "zod";
import { LocalitySchema } from "./LocalitySchema.ts";
import { UserShema } from "./UserShema.ts";

export const UpdateUserShema = UserShema.extend({
  locality: LocalitySchema.partial().optional(),
  id: z.string().optional(),
  slug: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
}).partial();

export type UpdateUser = z.infer<typeof UpdateUserShema>;
