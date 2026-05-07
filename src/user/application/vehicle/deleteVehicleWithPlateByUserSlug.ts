import { notFound } from "../../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import { deleteImage } from "../../../main/infrastructure/utils/deleteImage.ts";
import type { IVehicleRepository } from "../../../vehicle/domain/interfaces/ports/IVehicleRepository.js";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";

export const delete_vehicle_with_plate_by_user_slug = (
  userRepository: IUserRepository,
  vehicleRepository: IVehicleRepository,
) => {
  return async (slug: string, plate: string): Promise<Result<string>> => {
    const userExist = await userRepository.get_user_by_slug(slug);

    if (!userExist) return failure(notFound("User"));

    const vehicleExist = await vehicleRepository.get_vehicle_by_plate(plate);

    if (!vehicleExist) return failure(notFound("Vehicle"));

    if (vehicleExist.public_id_photo) {
      await deleteImage(userExist.public_id_photo);
    }

    userRepository.delete_vehicle_with_plate_by_user_slug(slug, plate);

    return success(204, "", "");
  };
};
