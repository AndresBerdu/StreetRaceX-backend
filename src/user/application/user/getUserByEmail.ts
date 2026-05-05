import type { IUserRepository } from "../../domain/interfaces/ports/IUserRepository.js";

export const get_user_by_email = (userRepository: IUserRepository) => {
  return async (email: string) => {
    return userRepository.get_user_by_email(email);
  };
};
