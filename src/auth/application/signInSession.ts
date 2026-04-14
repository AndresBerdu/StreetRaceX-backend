import type { AuthRepository } from "../domain/IAuthRepository.js";
import type { UserCredentials } from "../domain/interfaces/UserCrendentials.js";

export const sign_in_session = (authRepository: AuthRepository) => {
    return async (userCredentials: UserCredentials ) => {

        return authRepository.sign_in_session(userCredentials);
    }
}