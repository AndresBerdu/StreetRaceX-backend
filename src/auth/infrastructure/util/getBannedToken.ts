import { redis } from "../../../main/infrastructure/config/redisConfiguration.ts";

export const getBannedToken = async (token: string) => {
  const refresh_token = await redis.get(`banned_refresh_token:${token}`);

  return refresh_token
};
