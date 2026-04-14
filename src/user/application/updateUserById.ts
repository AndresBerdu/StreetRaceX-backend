import type { UserModel } from "../infrastructure/firebase/UserModel.ts";
import type { UserRepository } from "../domain/interfaces/IUserRepository.js";

export const update_user_by_id = (userRepository: UserRepository) => {
  return async (id: string, data: UserModel) => {
    if (data.id === id) throw new Error("YOU_CANNOT_CHANGE_ID_OF_USER");

    return userRepository.update_user_by_id(id, data);
  };
};
