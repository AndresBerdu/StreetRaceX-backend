import { failure, success, type Result } from "../../../main/domain/Result.ts";
import type { UserRepository } from "../../domain/interfaces/IUserRepository.js";
import type { User } from "../../domain/interfaces/User.js";

export const get_user_by_slug = (userRepository: UserRepository) => {
  return async (slug: string): Promise<Result<User>> => {

    /* validation for looking for the user by slug */
    const user = await userRepository.get_user_by_slug(slug);

    if(!user) failure(404, "User not found");

    return success(user, "User successful");
  };
};
