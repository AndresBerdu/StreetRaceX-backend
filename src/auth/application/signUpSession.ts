import type { User } from "../../user/domain/interfaces/User.js";
import type { AuthRepository } from "../domain/IAuthRepository.js";

export const sign_up_session = (authRepository: AuthRepository) => {
    return async (user: User) => {
        return authRepository.sign_up_session(user);
    }
}