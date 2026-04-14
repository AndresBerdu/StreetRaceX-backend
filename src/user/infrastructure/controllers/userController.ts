import type { Request, Response } from "express";
import { fireoUserRepository } from "../firebase/fireOrmUserRepository.ts";
import type { User } from "../../domain/interfaces/User.js";
import { create_user } from "../../application/createUser.ts";
import { get_users } from "../../application/getUsers.ts";
import { get_user_by_id } from "../../application/getUserById.ts";
import { get_user_by_username } from "../../application/getUserByUsername.ts";
import { update_user_by_id } from "../../application/updateUserById.ts";
import { delete_user_by_id } from "../../application/deleteUserById.ts";
import { UserShema } from "../../domain/schemas/UserShema.ts";
import { ZodError } from "zod/v4";

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

    console.log(users);

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
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const useCase = get_user_by_id(userRepository);
    const user = await useCase(id as string);

    return res.status(200).json({
      ok: true,
      data: user,
      message: "user obteined",
    });
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

/* Function to get a user by the username */
export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const useCase = get_user_by_username(userRepository);
    const user = await useCase(username as string);

    return res.status(200).json({
      ok: true,
      data: user,
      message: "user obtenined by username",
    });
  } catch (error) {}
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
      rank: "D",
      victories: 0,
      defeats: 0,
      consecutive_victories: 0,
      state: "active",
      updated_at: new Date(),
      created_at: new Date(),
    };

    const useCase = create_user(userRepository);
    const newUser = await useCase(userData);

    return res.status(201).json({
      ok: true,
      data: newUser,
      message: "new user created",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        error: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
    }

    if (error instanceof Error) {
      if (error.message === "USER_ALREADY_EXIST") {
        return res.status(409).json({
          ok: false,
          error: "user already exist",
        });
      }

      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

/* Function to update some field of user except the id */
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    const useCase = update_user_by_id(userRepository);
    const updatedUser = await useCase(id as string, newData);

    return res.status(200).json({
      ok: true,
      data: updatedUser,
      message: "user updated",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "YOU_CANNOT_CHANGE_ID_OF_USER") {
        return res.status(400).json({
          ok: false,
          error: "you cannot change id of user",
        });
      }

      return res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const useCase = delete_user_by_id(userRepository);
    await useCase(id as string);

    return res.status(204);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUNDED") {
        res.status(404).json({
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
