import type { User } from "../../domain/interfaces/User.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import { alreadyExist } from "../../../main/domain/AppError.ts";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";
import type { CreateUser } from "../../domain/schemas/CreateUserShema.ts";

export const create_user = (userRepository: IUserRepository) => {
  return async (data: CreateUser): Promise<Result<User>> => {
    /* Validation if the user try to create a new user with one username equal anther user */
    const userExist = await userRepository.get_user_by_username(data.username);

    if (userExist) return failure(alreadyExist("User"));

    /* Validation if the user try to create a new user with one email equal another user */
    const emailExist = await userRepository.get_user_by_email(data.email);

    if (emailExist) return failure(alreadyExist("Email"));

    const newUser = await userRepository.create_user(data);

    return success(201, newUser, "User create");
  };
};
