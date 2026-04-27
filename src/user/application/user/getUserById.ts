import { failure, success, type Result } from "../../../main/domain/Result.ts";
import type { UserRepository } from "../../domain/interfaces/IUserRepository.js";
import type { User } from "../../domain/interfaces/User.js";

export const get_user_by_id = (userRepository: UserRepository) => {
  return async (id: string): Promise<Result<User>> => {
    const user = await userRepository.get_user_by_id(id);

    if (!user) return failure(404, "User not found");

    return success(user);
  };
};
