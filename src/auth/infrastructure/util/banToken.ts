import { redis } from "../../../main/infrastructure/config/redisConfiguration.ts";

export const banTokens = async (accessToken: string, refreshToken: string) => {
  await redis.set(`banned_token:${accessToken}`, "true", {
    expiration: { type: "EX", value: 60 * 60 },
  });

    await redis.set(`banned_refresh_token:${refreshToken}`, "true", {
    expiration: { type: "EX", value: 60 * 60 * 24 * 7 },
  });
};
