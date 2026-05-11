import {
  notFound,
  unprocessableEntity,
} from "../../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import { removeUndefinedBoby } from "../../../main/infrastructure/utils/removeUndefinedBoby.ts";
import type { IVehicleRepository } from "../../../vehicle/domain/interfaces/ports/IVehicleRepository.js";
import {
  VehicleType,
  type Vehicle,
} from "../../../vehicle/domain/interfaces/Vehicle.js";
import type { UpdateVehicle } from "../../../vehicle/domain/schemas/UpdateVehicleShema.ts";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";

export const update_vehicle_by_vehicle_slug_by_user_slug = (
  userRepository: IUserRepository,
  vehicleRepository: IVehicleRepository,
) => {
  return async (
    slug: string,
    vehicle_slug: string,
    data: UpdateVehicle,
  ): Promise<Result<Vehicle>> => {
    
    /* You only can create one vehicle if there is a user */
    const userExist = await userRepository.get_user_by_slug(slug);

    if (!userExist) return failure(notFound("User"));

    /* You only can create one vehicle exist */
    const vehicleExist =
      await vehicleRepository.get_vehicle_by_slug(vehicle_slug);

    if (!vehicleExist) return failure(notFound("Vehicle"));

    /* Validation for the vehicle type and plate */
    const finalType = data.vehicle_type ?? vehicleExist.vehicle_type;
    const finalPlate =
      data.plate !== undefined ? data.plate : vehicleExist.plate;

    if (finalType === VehicleType.SKATE_BOARD && finalPlate !== null) {
      return failure(unprocessableEntity("Skate boards cannot have a plate"));
    }

    if (finalType !== VehicleType.SKATE_BOARD && finalPlate === null) {
      return failure(
        unprocessableEntity("Cars and motorcycles must have a plate"),
      );
    }

    /* Validation for change the field change  */
    if (data.active === true) {
      const allVehicles = await userRepository.get_vehicles_by_user_slug(slug);

      await Promise.all(
        allVehicles
          .filter(
            (v) => (v.active ?? false) === true && v.slug !== vehicleExist.slug,
          )
          .map((v) =>
            userRepository.update_vehicle_by_vehicle_slug_by_user_slug(
              slug,
              v.slug!,
              { active: false },
            ),
          ),
      );
    }

    const cleanData = removeUndefinedBoby(data);

    /* you only can create one vehicle if vehicle id is equals to param vehicle id */
    const vehicle =
      await userRepository.update_vehicle_by_vehicle_slug_by_user_slug(
        slug,
        vehicle_slug,
        cleanData,
      );

    return success(200, vehicle, "Vehicle update");
  };
};
