import { encryptPassword } from "../../main/infrastructure/security/encryptPassword.ts";
import type { User } from "../domain/interfaces/User.js";
import type { UserRepository } from "../domain/interfaces/IUserRepository.js";

export const create_user = (userRepository: UserRepository) => {
  return async (data: User) => {
    const userExist = await userRepository.get_user_by_username(data.username);

    if (userExist) throw new Error("USER_ALREADY_EXIST");

    data.password = await encryptPassword(data.password);
    
    return userRepository.create_user(data);
  };
};
