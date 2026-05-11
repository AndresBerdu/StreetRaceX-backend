import { getRepository } from "fireorm";
import type { IAuthRepository } from "../../domain/interfaces/ports/IAuthRepository.js";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../../../user/infrastructure/adapters/firebase/UserModel.ts";

/* implementation of use cases */
export const fireOrmAuthRepository = (): IAuthRepository => {
  const userRepository = getRepository(UserModel);
  return {
    /* Function for sign in session */
    async sign_in_session(userCredentials) {
      const user = await userRepository
        .whereEqualTo("username", userCredentials.username)
        .findOne();

      return user!;
    },

    /* Function for sign up session */
    async sign_up_session(user) {
      const userModel = new UserModel();

      Object.assign(userModel, user);

      userModel.id = uuidv4();

      return await userRepository.create(userModel);
    },
  };
};
