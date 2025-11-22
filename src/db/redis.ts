import { createClient } from "redis";
import { config } from "../config/env.config";
import { logError } from "../lib/logger";

export const redis = createClient({
  url: config.REDIS_URL,
});

redis.on("error", (err) => {
  logError("While conecting redis! ", err);
});

export async function initRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

export async function shutDownRedis() {
  if (redis.isOpen) {
    await redis.quit();
  }
}
