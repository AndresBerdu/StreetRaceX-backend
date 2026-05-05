import { notFound } from "../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../main/domain/Result.ts";
import type { IVehicleRepository } from "../domain/interfaces/ports/IVehicleRepository.js";
import type { Vehicle } from "../domain/interfaces/Vehicle.js";

export const get_vehicle_by_slug = (vehicleRepository: IVehicleRepository) => {
  return async (slug: string): Promise<Result<Vehicle | null>> => {
    const vehicleExist = await vehicleRepository.get_vehicle_by_slug(slug);

    if (!vehicleExist) return failure(notFound("Vehicle"));

    const vehicle = await vehicleRepository.get_vehicle_by_slug(slug);

    return success(200, vehicle, "vehicle obtained");
  };
};
