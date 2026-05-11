import z from "zod";
import { VehicleSchema } from "./VehicleShema.ts";

export const UpdateVehicleShema = VehicleSchema.extend({
  id: z.string().optional(),
  user_id: z.string().optional(),
  slug: z.string().optional(),
  public_id_photo: z.string().optional(),
  create_at: z.date().optional(),
  active: z.boolean().optional(),
}).partial();

export type UpdateVehicle = z.infer<typeof UpdateVehicleShema>;
