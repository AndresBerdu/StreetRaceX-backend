import { Collection } from "fireorm";
import type { VehicleType } from "../../../domain/interfaces/Vehicle.ts";

@Collection("vehicles")
export class VehicleModel {
  id!: string;
  user_id!: string;
  slug!: string;
  vehicle_type!: VehicleType;
  brand!: string;
  model!: string;
  year!: number;
  color!: string;
  plate!: string | null;
  photo!: string;
  public_id_photo!: string;
  modifications!: string | null;
  active!: boolean;
  created_at!: Date;
}
