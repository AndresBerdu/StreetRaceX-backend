import { alreadyExist } from "../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../main/domain/Result.ts";
import type { IUserRepository } from "../../user/domain/interfaces/ports/IUserRepository.js";

import type { User } from "../../user/domain/interfaces/User.ts";
import type { IAuthRepository } from "../domain/interfaces/ports/IAuthRepository.js";

export const sign_up_session = (
  authRepository: IAuthRepository,
  userRepository: IUserRepository,
) => {
  return async (data: User): Promise<Result<User>> => {
    /* validation if the user try to create a user with username already created */
    const userExist = await userRepository.get_user_by_username(data.username);

    if (userExist) return failure(alreadyExist("User"));

    /* Validation if the user try to create a new user with one email equal another user */
    const emailExist = await userRepository.get_user_by_email(data.email);

    if (emailExist) return failure(alreadyExist("Email"));

    const newUser = await authRepository.sign_up_session(data);

    return success(201, newUser, "User create");
  };
};
