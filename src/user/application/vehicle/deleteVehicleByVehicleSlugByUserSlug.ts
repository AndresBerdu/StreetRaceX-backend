import { notFound } from "../../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import { deleteImage } from "../../../main/infrastructure/utils/deleteImage.ts";
import type { IVehicleRepository } from "../../../vehicle/domain/interfaces/ports/IVehicleRepository.js";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";

export const delete_vehicle_by_slug_by_user_slug = (
  userRepository: IUserRepository,
  vehicleRepository: IVehicleRepository,
) => {
  return async (
    slug: string,
    vehicle_slug: string,
  ): Promise<Result<string>> => {
    /* Validation if user doesn't exist */
    const userExist = await userRepository.get_user_by_slug(slug);

    if (!userExist) return failure(notFound("User"));

    /* Validation if vehicle doesn't exist */
    const vehicleExist =
      await vehicleRepository.get_vehicle_by_slug(vehicle_slug);

    if (!vehicleExist) return failure(notFound("Vehicle"));

    /* Validation if photo is different to null */
    if (vehicleExist.public_id_photo)
      await deleteImage(vehicleExist.public_id_photo);

    userRepository.delete_vehicle_by_vehicle_slug_by_user_slug(
      slug,
      vehicle_slug,
    );

    return success(204, "", "");
  };
};
