import type { UserRepository } from "../../domain/interfaces/IUserRepository.js";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import type { User } from "../../domain/interfaces/User.js";

export const update_user_by_slug = (userRepository: UserRepository) => {
  return async (slug: string, data: Partial<User>): Promise<Result<User>> => {
    const user = await userRepository.get_user_by_slug(slug);

    /* Validation if there not user by the slug */
    if (!user) return failure(404, "User not found");

    /* Validation if user try to change the user id for other */
    if (data.id) return failure(422, "you cannot change the user id");

    /* Validation if user try to change the user slug for other */
    if (data.slug) return failure(422, "you cannot change the user slug");

    /* Validation if user try to change the date user creation for other */
    if (data.created_at)
      return failure(422, "you cannot change the date created at user");

    /* Validation if the user try to create a new user with one username equal anther user */
    const userExist = await userRepository.get_user_by_username(
      data.username as string,
    );

    if (userExist) return failure(409, "User already exist");

    /* Validation if the user try to create a new user with one email equal another user */
    const emailExist = await userRepository.get_user_by_email(
      data.email as string,
    );

    if (emailExist) return failure(409, "Email already exist");


    const userUpdated = await userRepository.update_user_by_slug(slug, data);

    return success(userUpdated, "User update");
  };
};
