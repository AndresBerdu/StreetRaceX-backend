import type { promises } from "node:dns";
import type { Vehicle } from "./Vehicle.js";

export interface IVehicleRepository {
  get_vehicle_by_plate(plate: string): Promise<Vehicle | null>;
}
