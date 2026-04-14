import type { UserRepository } from "../domain/interfaces/IUserRepository.js";

export const get_users = (userRepository: UserRepository) => {
  return async (page: number, size: number) => {
    const totalItems = await userRepository.count_users();
    const totalPages = Math.ceil(totalItems / size);

    const users = await userRepository.get_users(page, size);

    return { users, totalItems, totalPages}
  };
};
