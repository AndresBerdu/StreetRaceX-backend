import type { UserRepository } from "../domain/interfaces/IUserRepository.js";

export const delete_user_by_id = (userRepositoy: UserRepository) => {
  return async (id: string) => {
    const userExist = await userRepositoy.get_user_by_id(id);

    if (!userExist) throw new Error("USER_NOT_FOUNDED");
    
    return userRepositoy.delete_user_by_id(id);
  };
};
