import type { IBannedRepository } from "../../domain/interfaces/ports/IBannedRepository.js";
import { banTokens } from "../util/banToken.ts";
import { getBannedToken } from "../util/getBannedToken.ts";

export const redisAuthRepository = (): IBannedRepository => ({
  async is_token_banned(refreshToken) {
    const token = await getBannedToken(refreshToken);

    return token;
  },

  async logue_out_session(accessToken, refreshToken) {
    await banTokens(accessToken, refreshToken);
  },
});
