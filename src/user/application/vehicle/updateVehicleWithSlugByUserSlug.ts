import {
  forbidden,
  notFound,
  unprocessableEntity,
} from "../../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import type { IVehicleRepository } from "../../../vehicle/domain/interfaces/ports/IVehicleRepository.js";
import type { Vehicle } from "../../../vehicle/domain/interfaces/Vehicle.js";
import type { UpdateVehicle } from "../../../vehicle/domain/schemas/UpdateVehicleShema.ts";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";

export const update_vehicle_with_slug_by_user_slug = (
  userRepository: IUserRepository,
  vehicleRepository: IVehicleRepository,
) => {
  return async (
    slug: string,
    vehicle_slug: string,
    data: UpdateVehicle,
  ): Promise<Result<Vehicle>> => {
    const userExist = await userRepository.get_user_by_slug(slug);

    if (!userExist) return failure(notFound("User"));

    const vehicleExist =
      await vehicleRepository.get_vehicle_by_slug(vehicle_slug);

    if (!vehicleExist) return failure(notFound("Vehicle"));

    if (vehicleExist.plate) {
      return failure(
        unprocessableEntity(
          "You cannot update plate in this route, you need use update vehicle with plate by user slug",
        ),
      );
    }

    if (
      (data.vehicle_type && !data.plate) ||
      (!data.vehicle_type && data.plate)
    ) {
      return failure(
        unprocessableEntity(
          "You cannot update one vehicle witout plate if you don't change vehicle type with plate or you don't send one plate with vehicle plate",
        ),
      );
    }

    if (data.slug || data.id || data.user_id || data.create_at) {
      return failure(
        forbidden("you cannot change the fields slug, id, user_id or"),
      );
    }

    const vehicle = await userRepository.update_vehicle_with_slug_by_user_slug(
      slug,
      vehicle_slug,
      data,
    );

    return success(200, vehicle, "vehicle update");
  };
};
