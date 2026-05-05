import { notFound } from "../../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";
import type { User } from "../../domain/interfaces/User.js";

export const get_user_by_slug = (userRepository: IUserRepository) => {
  return async (slug: string): Promise<Result<User>> => {

    /* validation for looking for the user by slug */
    const user = await userRepository.get_user_by_slug(slug);

    if(!user) failure(notFound("User"));

    return success(200, user, "User successful");
  };
};
