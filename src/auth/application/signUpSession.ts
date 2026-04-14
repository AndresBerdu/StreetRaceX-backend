import { encryptPassword } from "../../main/infrastructure/security/encryptPassword.ts";
import type { UserRepository } from "../../user/domain/interfaces/IUserRepository.js";
import type { User } from "../../user/domain/interfaces/User.js";
import type { AuthRepository } from "../domain/IAuthRepository.js";

export const sign_up_session = (
  authRepository: AuthRepository,
  userRepository: UserRepository,
) => {
  return async (user: User) => {
    const userExist = await userRepository.get_user_by_username(user.username);

    if (userExist) throw new Error("USER_ALREADY_EXIST");

    user.password = await encryptPassword(user.password);

    return authRepository.sign_up_session(user);
  };
};
