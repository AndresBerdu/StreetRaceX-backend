import type { IVehicleRepository } from "../../../vehicle/domain/interfaces/IVehicleRepository.js";
import type { Vehicle } from "../../../vehicle/domain/interfaces/Vehicle.js";
import type { UserRepository } from "../../domain/interfaces/IUserRepository.js";

export const create_vehicle_by_user_id = (
  userRepository: UserRepository,
  vehicleRepository: IVehicleRepository,
) => {
  return async (slug: string, vehicle: Vehicle) => {
    /* You only can create one vehicle if there is a user */

    const userExist = await userRepository.get_user_by_slug(slug);

    if (!userExist) throw new Error("USER_NOT_FOUNDED");

    /* Validation if one user want to create a new vehicle with plate equals another vehicle */
    if (vehicle.plate) {
      const vehicleExist = await vehicleRepository.get_vehicle_by_plate(
        vehicle.plate,
      );

      if (vehicleExist) throw new Error("THIS_VEHICLE_IS_ALREADY_REGISTERED");
    }

    if (
      (vehicle.vehicle_type === "car" ||
        vehicle.vehicle_type === "motorcycle") &&
      !vehicle.plate
    ) {
      throw new Error("CARS_AND_MOTORCYCLES_MUST_HAVE_PLATE");
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

      return await userRepository.create_vehicle_by_user_slug(slug, vehicle);
    }

    /* When you create a new vehicle it self is your principal vehicle and others change 
    the fiel active to false */

    if (totalVehicles.length >= 3) throw new Error("ONLY_3_VEHICLES_PER_USER");

    if (vehicle.vehicle_type === "skate_board" && vehicle.plate !== null)
      throw new Error("YOU_CANNOT_CREATE_A_SKATE_BOARD_WITH_PLATE");

    vehicle.user_id = userExist.id as string;
    vehicle.active = false;

    return userRepository.create_vehicle_by_user_slug(slug, vehicle);
  };
};
