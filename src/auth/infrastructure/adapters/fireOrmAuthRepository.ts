import { getRepository } from "fireorm";
import { UserModel } from "../../../user/infrastructure/firebase/UserModel.ts";
import type { IAuthRepository } from "../../domain/interfaces/ports/IAuthRepository.js";
import { v4 as uuidv4 } from "uuid";

const userRepository = getRepository(UserModel);

export const fireOrmAuthRepository = (): IAuthRepository => ({

  /* Cases of use functions */
  async sign_in_session(userCredentials) {
    const user = await userRepository
      .whereEqualTo("username", userCredentials.username)
      .findOne();

    return user!;
  },

  async sign_up_session(user) {
    const userModel = new UserModel();

    Object.assign(userModel, user);

    userModel.id = uuidv4();

    return await userRepository.create(userModel);
  },
});
