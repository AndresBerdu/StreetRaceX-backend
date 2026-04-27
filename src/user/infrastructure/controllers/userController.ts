import type { Request, Response } from "express";
import { fireoUserRepository } from "../firebase/fireOrmUserRepository.ts";
import type { User } from "../../domain/interfaces/User.js";
import { create_user } from "../../application/user/createUser.ts";
import { get_users } from "../../application/user/getUsers.ts";
import { UserShema } from "../../domain/schemas/UserShema.ts";
import { ZodError } from "zod/v4";
import { generateSlug } from "../../../main/infrastructure/utils/generateSlug.ts";
import { get_user_by_slug } from "../../application/user/getUserBySlug.ts";
import { delete_user_by_slug } from "../../application/user/deleteUserBySlug.ts";
import { update_user_by_slug } from "../../application/user/updateUserBySlug.ts";
import { handleResponse } from "../../../main/infrastructure/middlewares/handleResponseMiddleware.ts";
import { UpdateUserShema } from "../../domain/schemas/UpdateUserShema.ts";

/* Repository from fireOrmRepository */
const userRepository = fireoUserRepository();

/* Function to get users using pages and amout items per page
  default values of query params:

  page: 1 - initial page
  size: 10 - amout of items per page
*/
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const useCase = get_users(userRepository);
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
  const result = await get_user_by_slug(fireoUserRepository())(
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
    const parserd = UserShema.parse(req.body);

    const userData: User = {
      ...parserd,
      slug: generateSlug("user"),
      rank: "D",
      victories: 0,
      defeats: 0,
      consecutive_victories: 0,
      state: "active",
      updated_at: new Date(),
      created_at: new Date(),
    };

    const result = await create_user(fireoUserRepository())(userData);
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

/* Function to update some field of user except the id */
export const updateUserBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const newData = UpdateUserShema.parse(req.body);

    console.log(newData)

    const result = await update_user_by_slug(fireoUserRepository())(
      slug,
      newData,
    );

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

    const useCase = delete_user_by_slug(userRepository);
    await useCase(slug);

    return res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUNDED") {
        return res.status(404).json({
          ok: false,
          error: "user not founded",
        });
      }

      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};
