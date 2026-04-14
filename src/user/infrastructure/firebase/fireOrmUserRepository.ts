import { getRepository } from "fireorm";
import { UserModel } from "./UserModel.ts";
import type { UserRepository } from "../../domain/interfaces/IUserRepository.js";
import { v4 as uuidv4 } from "uuid";

const userFireRepository = getRepository(UserModel);

export const fireoUserRepository = (): UserRepository => ({
  
  async count_users() {
    const users = await userFireRepository.find();
    return users.length
  },

  async get_users(page: number, size: number) {
  
    const skip = (page - 1) * size;

    const users = await userFireRepository
      .orderByAscending("created_at")
      .limit(skip + size)
      .find();

    return users.slice(skip, skip + size);
  },

  async get_user_by_id(id) {
    const user = await userFireRepository.findById(id);

    if (!user) return null;

    return user;
  },

  async get_user_by_username(username) {
    const user = await userFireRepository
      .whereEqualTo("username", username)
      .find();

    if (!user[0]) return null;

    return user[0];
  },

  async create_user(user) {
    const userModel = new UserModel();

    Object.assign(userModel, user);

    userModel.id = uuidv4();

    return await userFireRepository.create(userModel);
  },

  async update_user_by_id(id, data) {
    const user = await userFireRepository.findById(id);

    if (!user) {
      throw new Error("user not found");
    }

    Object.assign(user, data);
    user.updated_at = new Date();

    return await userFireRepository.update(user);
  },

  async update_user_by_username(username) {},

  async delete_user_by_id(id) {
    console.log(id);
    const user = await userFireRepository.findById(id);

    if (!user) {
      throw new Error("user not found");
    }

    await userFireRepository.delete(id);
  },

  async delete_user_by_username(username) {},
});
