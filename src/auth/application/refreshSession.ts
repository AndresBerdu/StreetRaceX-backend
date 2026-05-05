import { unauthorized } from "../../main/domain/AppError.ts";
import { failure, success, type Result } from "../../main/domain/Result.ts";
import type { IBannedRepository } from "../domain/interfaces/ports/IBannedRepository.js";

export const refresh_session = (authRepository: IBannedRepository) => {
  return async (refresh_token: string): Promise<Result<null>> => {
    const tokenExist = await authRepository.is_token_banned(refresh_token);

    /* Validation if the user try to get a new session with tokens banned */
    if (tokenExist)
      return failure(unauthorized("Your token is invalid"));

    return success(204, null, "New token created");
  };
};
