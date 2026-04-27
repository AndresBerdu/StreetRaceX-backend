import { Collection } from "fireorm";
import type { vehicle_type } from "../../domain/interfaces/Vehicle.js";

@Collection("vehicles") 
export class VehicleModel {
  id!: string;
  user_id!: string;
  vehicle_type!: vehicle_type;
  brand!: string;
  model!: string;
  year!: number;
  color!: string;
  plate!: string | null;
  photo!: string;
  modifications!: string;
  active!: boolean;
  created_at!: Date;
}