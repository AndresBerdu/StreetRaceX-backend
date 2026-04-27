import type { UserRepository } from "../../domain/interfaces/IUserRepository.js";

export const get_user_by_email = (userRepository: UserRepository) => {
  return async (email: string) => {
    return userRepository.get_user_by_email(email);
  };
};
