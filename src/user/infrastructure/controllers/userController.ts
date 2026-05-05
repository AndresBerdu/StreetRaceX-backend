import type { Request, Response } from "express";
import type { User } from "../../domain/interfaces/User.js";
import { create_user } from "../../application/user/createUser.ts";
import { get_users } from "../../application/user/getUsers.ts";
import { UserShema } from "../../domain/schemas/UserShema.ts";
import { generateSlug } from "../../../main/infrastructure/utils/generateSlug.ts";
import { get_user_by_slug } from "../../application/user/getUserBySlug.ts";
import { delete_user_by_slug } from "../../application/user/deleteUserBySlug.ts";
import { update_user_by_slug } from "../../application/user/updateUserBySlug.ts";
import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";
import { UpdateUserShema } from "../../domain/schemas/UpdateUserShema.ts";
import { fireOrmUserRepository } from "../firebase/fireOrmUserRepository.ts";
import { encryptPassword } from "../../../main/infrastructure/security/encryptPassword.ts";
import { uploadImage } from "../../../main/infrastructure/utils/uploadImage.ts";
import { removeUndefinedBoby } from "../../../main/infrastructure/utils/removeUndefinedBoby.ts";
import { updateImage } from "../../../main/infrastructure/utils/updateImage.ts";

/* Repository from fireOrmRepository */
const userFireRepository = fireOrmUserRepository();

/* Function to get users using pages and amout items per page
  default values of query params:

  page: 1 - initial page
  size: 10 - amout of items per page
*/
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const useCase = get_users(userFireRepository);
    const { users, totalItems, totalPages } = await useCase(page, size);

    return res.status(200).json({
      ok: true,
      data: users,
      meta: {
        page,
        totalPages,
        totalItems,
      },
      message: "Users obteined",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

/* Function to get a user by the id */
export const getUserBySlug = async (req: Request, res: Response) => {
  const result = await get_user_by_slug(userFireRepository)(
    req.params.slug as string,
  );
  handleResponse(res, result);
};

/* Functions to create a new user, for logic of use case some values start with next values
    rank: "D",
    victories: 0,
    defeats: 0,
    consecutive_victories: 0,
    state: "active",
    updated_at: today date,
    created_at: today date,
*/
export const createUser = async (req: Request, res: Response) => {
  try {
    req.body.locality = JSON.parse(req.body.locality);
    /* Fistly the object locality is convert to object */

    const { username, password, email, locality } = UserShema.parse(req.body);

    const userData: User = {
      username,
      password: await encryptPassword(password),
      email,
      locality,
      profile_photo: null,
      public_id_photo: null,
      slug: generateSlug("user"),
      role: "racer",
      rank: "D",
      victories: 0,
      defeats: 0,
      consecutive_victories: 0,
      state: "active",
      updated_at: new Date(),
      created_at: new Date(),
    };

    const result = await create_user(userFireRepository)(userData);

    /* Validation for upload the image to cloudinary  */
    if (result.ok && req.file) {
      const imageUrl = await uploadImage(req, "users/profile_photos");

      await userFireRepository.update_user_by_slug(result.data.slug, {
        profile_photo: imageUrl?.imageUrl,
        public_id_photo: imageUrl?.publicId
      });

      result.data.profile_photo = imageUrl?.imageUrl ?? null;
      result.data.public_id_photo = imageUrl?.publicId ?? null;
    }

    handleResponse(res, result);
  } catch (error) {
    if (typeof req.body.locality !== "string") {
      return res.status(422).json({
        ok: false,
        error: "locality is require",
      });
    }

    if ((error as any)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as any).issues,
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

/* Function to update some field of user except the id */
export const updateUserBySlug = async (req: Request, res: Response) => {
  try {
    if (typeof req.body.locality === "string") {
      req.body.locality = JSON.parse(req.body.locality);
    }

    const slug = req.params.slug as string;
    let newData = UpdateUserShema.parse(req.body);

    newData = removeUndefinedBoby(newData);

    const result = await update_user_by_slug(userFireRepository)(slug, newData);

    if (result.ok && req.file) {
      const imageUrl = await updateImage(
        req.file.buffer,
        result.data.public_id_photo,
        "users/profile_photos",
      );

      await userFireRepository.update_user_by_slug(result.data.slug, {
        profile_photo: imageUrl?.imageUrl,
        public_id_photo: imageUrl?.publicId
      });

      result.data.profile_photo = imageUrl.imageUrl;
      result.data.public_id_photo = imageUrl.publicId;
    }

    handleResponse(res, result);
  } catch (error) {
    if ((error as any)?.constructor?.name === "ZodError") {
      return res.status(422).json({
        ok: false,
        error: (error as any).issues,
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const deleteUserBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;

    const useCase = delete_user_by_slug(userFireRepository);
    await useCase(slug);

    return res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};
