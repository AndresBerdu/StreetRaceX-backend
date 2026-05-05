import type { IVehicleRepository } from "../domain/interfaces/ports/IVehicleRepository.js";

export const get_vehicle_by_plate = (vehicleRepository: IVehicleRepository) => {
  return async (plate: string) => {
    if (plate === "")
      throw new Error("YOU_CANNOT_SEARCH_SKATE_BOARDS_BY_PLATE");

    const vehicleExist = await vehicleRepository.get_vehicle_by_plate(plate);

    if (!vehicleExist) throw new Error("VEHICLE_DON'T_EXIST");

    return vehicleRepository.get_vehicle_by_plate(plate);
  };
};
