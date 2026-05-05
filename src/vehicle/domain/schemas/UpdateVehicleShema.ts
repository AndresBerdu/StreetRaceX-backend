import z from "zod";
import { VehicleSchema } from "./VehicleShema.ts";

export const UpdateVehicleShema = VehicleSchema.extend({
  id: z.string().optional(),
  user_id: z.string().optional(),
  slug: z.string().optional(),
  create_at: z.date().optional(),
}).partial();

export type UpdateVehicle = z.infer<typeof UpdateVehicleShema>;
