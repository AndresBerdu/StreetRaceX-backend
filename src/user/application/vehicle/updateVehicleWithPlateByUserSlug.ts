import {
  alreadyExist,
  forbidden,
  notFound,
  unprocessableEntity,
} from "../../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import { removeUndefinedBoby } from "../../../main/infrastructure/utils/removeUndefinedBoby.ts";
import type { IVehicleRepository } from "../../../vehicle/domain/interfaces/ports/IVehicleRepository.js";
import type { Vehicle } from "../../../vehicle/domain/interfaces/Vehicle.js";
import type { UpdateVehicle } from "../../../vehicle/domain/schemas/UpdateVehicleShema.ts";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";

export const update_vehicle_with_plate_by_user_slug = (
  userRepository: IUserRepository,
  vehicleRepository: IVehicleRepository,
) => {
  return async (
    slug: string,
    plate: string,
    data: UpdateVehicle,
  ): Promise<Result<Vehicle>> => {
    /* You only can create one vehicle if there is a user */

    const userExist = await userRepository.get_user_by_slug(slug);

    if (!userExist) return failure(notFound("User"));

    /* You only can create one vehicle if plate exist */
    const vehicleExist = await vehicleRepository.get_vehicle_by_plate(plate);

    if (!vehicleExist) return failure(notFound("Vehicle"));

    if (data.vehicle_type !== undefined || data.plate !== undefined) {
      if (data.vehicle_type === undefined || data.plate === undefined) {
        return failure(
          unprocessableEntity(
            "You must send both vehicle_type and plate together",
          ),
        );
      }

      if (data.plate !== null) {
        return failure(
          unprocessableEntity(
            "To update a vehicle without plate you must send plate as null",
          ),
        );
      }

      if (data.vehicle_type !== "skate_board") {
        return failure(
          unprocessableEntity(
            "Vehicles without plate must be of type 'skate_board'",
          ),
        );
      }
    }

    if (data.slug || data.id || data.user_id || data.create_at) {
      return failure(
        unprocessableEntity(
          "you cannot change the fields slug, id, user_id or",
        ),
      );
    }
    if (data.active === true) {
      const allVehicles = await userRepository.get_vehicles_by_user_slug(slug);

      await Promise.all(
        allVehicles
          .filter(
            (v) => (v.active ?? false) === true && v.slug !== vehicleExist.slug,
          )
          .map((v) =>
            userRepository.update_vehicle_with_plate_by_user_slug(
              slug,
              v.plate!, 
              { active: false },
            ),
          ),
      );
    }

    const cleanData = removeUndefinedBoby(data);
    /* you only can create one vehicle if vehicle id is equals to param vehicle id */
    const vehicle = await userRepository.update_vehicle_with_plate_by_user_slug(
      slug,
      plate,
      cleanData,
    );

    return success(200, vehicle, "Vehicle update");
  };
};
