import type { UserRepository } from "../../domain/interfaces/IUserRepository.js";

export const delete_user_by_slug = (userRepositoy: UserRepository) => {
  return async (slug: string) => {
    const userExist = await userRepositoy.get_user_by_slug(slug);

    if (!userExist) throw new Error("USER_NOT_FOUNDED");
    
    return userRepositoy.delete_user_by_slug(slug);
  };
};
