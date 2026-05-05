import {
  alreadyExist,
  forbidden,
  notFound,
  unprocessableEntity,
} from "../../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import type { IVehicleRepository } from "../../../vehicle/domain/interfaces/ports/IVehicleRepository.js";
import type { Vehicle } from "../../../vehicle/domain/interfaces/Vehicle.js";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";

export const create_vehicle_by_user_slug = (
  userRepository: IUserRepository,
  vehicleRepository: IVehicleRepository,
) => {
  return async (slug: string, vehicle: Vehicle): Promise<Result<Vehicle>> => {
    /* You only can create one vehicle if there is a user */

    const userExist = await userRepository.get_user_by_slug(slug);

    if (!userExist) return failure(notFound("User"));

    /* Validation if one user want to create a new vehicle with plate equals another vehicle */
    if (vehicle.plate) {
      const vehicleExist = await vehicleRepository.get_vehicle_by_plate(
        vehicle.plate,
      );

      if (vehicleExist) return failure(alreadyExist("Vehicle"));
    }

    if (
      (vehicle.vehicle_type === "car" ||
        vehicle.vehicle_type === "motorcycle") &&
      !vehicle.plate
    ) {
      return failure(
        unprocessableEntity("Vehicles and motorcicles must be have one plate"),
      );
    }

    /* You can only create one vehicle if the user don't have more 3 vehicles */

    const totalVehicles = await userRepository.get_vehicles_by_user_slug(
      userExist.slug,
    );

    /* When one user created a new vehicle automatically this vehicle it's the
    vehicle active*/
    if (totalVehicles.length === 0) {
      vehicle.user_id = userExist.id as string;
      vehicle.active = true;

      const newVehicle = await userRepository.create_vehicle_by_user_slug(
        slug,
        vehicle,
      );

      return success(201, newVehicle, "User create");
    }

    /* When you create a new vehicle it self is your principal vehicle and others change 
    the fiel active to false */

    if (totalVehicles.length >= 3)
      return failure(
        forbidden("You cannot create more of 3 vehicles per user"),
      );

    if (vehicle.vehicle_type === "skate_board" && vehicle.plate !== null)
      return failure(forbidden("You cannot create one skate board with plate"));

    vehicle.user_id = userExist.id as string;
    vehicle.active = false;

    const newVehicle = await userRepository.create_vehicle_by_user_slug(
      slug,
      vehicle,
    );

    return success(201, newVehicle, "User create");
  };
};
