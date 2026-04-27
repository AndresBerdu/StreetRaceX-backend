import type { IVehicleRepository } from "../../../vehicle/domain/interfaces/IVehicleRepository.js";
import type { Vehicle } from "../../../vehicle/domain/interfaces/Vehicle.js";
import type { UserRepository } from "../../domain/interfaces/IUserRepository.js";

export const update_vehicle_with_plate_by_user_slug = (
  userRepository: UserRepository,
  vehicleRepository: IVehicleRepository,
) => {
  return async (slug: string, plate: string, data: Vehicle) => {
    /* You only can create one vehicle if there is a user */

    const userExist = await userRepository.get_user_by_slug(slug);

    if (!userExist) throw new Error("USER_NOT_FOUND");

    /* You only can create one vehicle if plate exist */
    const vehicleExist = await vehicleRepository.get_vehicle_by_plate(plate);

    if (!vehicleExist) throw new Error("VEHICLE_NOT_FOUND");

    if (data.user_id) throw new Error("YOU_CANNOT_CHANGE_THE_USER_ID");

    if (data.id) throw new Error("YOU_CANNOT_CHANGE_THE_ID");

    if (data.created_at)
      throw new Error("YOU_CANNOT_CHANGE_THE_DATE_OF_CREATION");

    /* you only can create one vehicle if vehicle id is equals to param vehicle id */

    return userRepository.update_vehicle_with_plate_by_user_slug(
      slug,
      plate,
      data,
    );
  };
};
