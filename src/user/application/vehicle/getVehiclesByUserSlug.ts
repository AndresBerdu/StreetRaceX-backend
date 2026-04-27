import type { UserRepository } from "../../domain/interfaces/IUserRepository.js";

export const get_vehicles_by_user_slug = (userRepository: UserRepository) => {
    return async (slug: string) => {

        /* validation if the user doesn't exist */
        const user = await userRepository.get_user_by_slug(slug);

        if (!user) throw new Error("THE_USER_DOESN'T_EXIST");

        return userRepository.get_vehicles_by_user_slug(slug);
    }
}