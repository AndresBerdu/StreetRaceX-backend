import { notFound } from "../../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../../main/domain/Result.ts";
import { deleteImage } from "../../../main/infrastructure/utils/deleteImage.ts";
import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";

export const delete_user_by_slug = (userRepositoy: IUserRepository) => {
  return async (slug: string): Promise<Result<string>> => {
    const userExist = await userRepositoy.get_user_by_slug(slug);

    if (!userExist) return failure(notFound("User"));

    if (userExist.public_id_photo) {
      await deleteImage(userExist.public_id_photo);
    }

    await userRepositoy.delete_user_by_slug(slug);

    return success(204, "", "");
  };
};
