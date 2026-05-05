import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";


export const get_user_by_username = (userRepository: IUserRepository) => {
  return async (username: string) => {
    return userRepository.get_user_by_username(username);
  };
};
