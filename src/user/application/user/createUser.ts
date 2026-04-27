import { encryptPassword } from "../../../main/infrastructure/security/encryptPassword.ts";
import type { User } from "../../domain/interfaces/User.js";
import type { UserRepository } from "../../domain/interfaces/IUserRepository.js";
import { failure, success, type Result } from "../../../main/domain/Result.ts";

export const create_user = (userRepository: UserRepository) => {
  return async (data: User): Promise<Result<User>> => {
    /* Validation if the user try to create a new user with one username equal anther user */
    const userExist = await userRepository.get_user_by_username(data.username);

    if (userExist) return failure(409, "User already exist");

    /* Validation if the user try to create a new user with one email equal another user */
    const emailExist = await userRepository.get_user_by_email(data.email);

    if (emailExist) return failure(409, "Email already exist");

    const hashedPassword = await encryptPassword(data.password);

    const newUser = await userRepository.create_user({
      ...data,
      password: hashedPassword,
    });

    return success(newUser, "User create");
  };
};
