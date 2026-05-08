import {
  notFound,
  unauthorized,
} from "../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../main/domain/Result.ts";
import { comparatePassword } from "../../main/infrastructure/security/comparatePassword.ts";
import type { IUserRepository } from "../../user/domain/interfaces/ports/IUserRepository.js";
import type { User } from "../../user/domain/interfaces/User.js";
import type { IAuthRepository } from "../domain/interfaces/ports/IAuthRepository.js";
import type { UserCredentials } from "../domain/interfaces/UserCrendentials.js";

export const sign_in_session = (
  authRepository: IAuthRepository,
  userRepository: IUserRepository,
) => {
  return async (userCredentials: UserCredentials): Promise<Result<User>> => {
    /* validacion if the user does not exist */
    const userExist = await userRepository.get_user_by_username(
      userCredentials.username,
    );

    if (!userExist) return failure(notFound("User"));

    /* Validation if the passwords don't match */
    const arePasswordEquals = await comparatePassword(
      userCredentials.password,
      userExist.password,
    );

    if (!arePasswordEquals)
      return failure(unauthorized("Password doesn't match the user's"));

    const user = await authRepository.sign_in_session(userCredentials);

    return success(200, user, "session started");
  };
};
