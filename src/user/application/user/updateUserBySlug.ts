import { failure, success, type Result } from "../../../main/domain/Result.ts";
import type { User } from "../../domain/interfaces/User.js";
import {
  alreadyExist,
  notFound,
  unprocessableEntity,
} from "../../../main/domain/AppError.ts";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";
import type { UpdateUser } from "../../domain/schemas/UpdateUserShema.ts";

export const update_user_by_slug = (userRepository: IUserRepository) => {
  return async (slug: string, data: UpdateUser): Promise<Result<User>> => {
    const user = await userRepository.get_user_by_slug(slug);

    /* Validation if there not user by the slug */
    if (!user) return failure(notFound("user"));

    /* Validation if user try to change the user id for other */
    if (data.id) return failure(unprocessableEntity("Id"));

    /* Validation if user try to change the user slug for other */
    if (data.slug) return failure(unprocessableEntity("Slug"));

    /* Validation if user try to change the date user creation for other */
    if (data.created_at) return failure(unprocessableEntity("Date"));

    /* Validation if the user try to create a new user with one username equal anther user */
    if (data.username) {
      const userExist = await userRepository.get_user_by_username(
        data.username as string,
      );

      if (userExist) return failure(alreadyExist("User"));
    }

    /* Validation if the user try to create a new user with one email equal another user */
    if (data.email) {
      const emailExist = await userRepository.get_user_by_email(
        data.email as string,
      );

      if (emailExist) return failure(alreadyExist("Email"));
    }

    const userUpdated = await userRepository.update_user_by_slug(slug, data);

    return success(200, userUpdated, "User update");
  };
};
