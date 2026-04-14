import { getRepository } from "fireorm";
import { UserModel } from "../../../user/infrastructure/firebase/UserModel.ts";
import type { AuthRepository } from "../../domain/IAuthRepository.js";
import { v4 as uuidv4 } from "uuid";

const UserRepository = getRepository(UserModel);

export const fireOrmAuthRepository = (): AuthRepository => ({
  async sign_in_session(userCredentials) {
    const user = await UserRepository.whereEqualTo(
      "username",
      userCredentials.username,
    ).findOne();

    return user;
  },

  async sign_up_session(user) {
    const userModel = new UserModel();

    Object.assign(userModel, user);

    userModel.id = uuidv4();

    return await UserRepository.create(userModel);
  },
});
