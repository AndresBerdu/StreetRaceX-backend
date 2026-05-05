import { success, type Result } from "../../main/domain/Result.ts";
import type { IBannedRepository } from "../domain/interfaces/ports/IBannedRepository.js";

export const logue_out_session = (authRepository: IBannedRepository) => {
  return async (
    accessToken: string,
    refreshToken: string,
  ): Promise<Result<null>> => {
    await authRepository.logue_out_session(accessToken, refreshToken);

    return success(204, null, "session left");
  };
};
