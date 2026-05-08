import type { IBannedRepository } from "../../domain/interfaces/ports/IBannedRepository.js";
import { banTokens } from "../util/banToken.ts";
import { getBannedToken } from "../util/getBannedToken.ts";

/* implementation of use cases */
export const redisAuthRepository = (): IBannedRepository => ({

  /* Auxiliar function for kwon if one token is banned */
  async is_token_banned(refreshToken) {
    const token = await getBannedToken(refreshToken);

    return token;
  },

  /* Function for logue out session */
  async logue_out_session(accessToken, refreshToken) {
    await banTokens(accessToken, refreshToken);
  },
});
