import { notFound } from "../../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";
import type { User } from "../../domain/interfaces/User.ts";

export const get_user_by_id = (userRepository: IUserRepository) => {
  return async (id: string): Promise<Result<User>> => {
    const user = await userRepository.get_user_by_id(id);

    if (!user) return failure(notFound("User"));
    
    return success(200, user, "User get it");
  };
};
