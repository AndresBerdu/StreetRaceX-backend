import { createClient } from "redis";

export const redis = createClient({
  username: "default",
  password: "ujWkjDj6VLH4W7pveZpFAMgyGeJwW0D0",
  socket: {
    host: "redis-14124.c259.us-central1-2.gce.cloud.redislabs.com",
    port: 14124,
  },
});


try {
  redis.on("error", (err) => console.log("Redis Client Error", err));
  await redis.connect();

  console.log("Redis server connected")
} catch (error) {
    console.log(error)
}
