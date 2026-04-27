import { getRepository } from "fireorm";
import type { IVehicleRepository } from "../../domain/interfaces/IVehicleRepository.js";
import { VehicleModel } from "./VehicleModel.ts";

const vehicleFireRepository = getRepository(VehicleModel);

export const fireOrmVehicleRepository = (): IVehicleRepository => ({
  async get_vehicle_by_plate (plate)  {
    return vehicleFireRepository.whereEqualTo("plate", plate).findOne()
  }
});
