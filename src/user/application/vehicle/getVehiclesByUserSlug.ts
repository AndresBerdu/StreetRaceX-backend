import { notFound } from "../../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import type { Vehicle } from "../../../vehicle/domain/interfaces/Vehicle.js";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";

export const get_vehicles_by_user_slug = (userRepository: IUserRepository) => {
  return async (slug: string): Promise<Result<Vehicle[]>> => {
    /* validation if the user doesn't exist */
    const user = await userRepository.get_user_by_slug(slug);

    if (!user) return failure(notFound("User doesn't exist"));

    const vehicles = await userRepository.get_vehicles_by_user_slug(slug);

    return success(200, vehicles, "vehicles found");
  };
};
