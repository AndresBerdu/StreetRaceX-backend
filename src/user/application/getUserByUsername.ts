import type { UserRepository } from "../domain/interfaces/IUserRepository.js";

export const get_user_by_username = (userRepository: UserRepository) => {
  return async (username: string) => {
    return userRepository.get_user_by_username(username);
  };
};
