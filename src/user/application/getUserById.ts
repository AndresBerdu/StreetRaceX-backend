import type { UserRepository } from "../domain/interfaces/IUserRepository.js";

export const get_user_by_id = (userRepository: UserRepository) => {
  return async (id: string) => {
    const user = await userRepository.get_user_by_id(id);

    if(!user) throw new Error("USER_NOT_FOUNDED");

    return userRepository.get_user_by_id(id);
  };
};
