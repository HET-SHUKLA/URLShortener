import { createClient, RedisArgument } from "redis";
import { config } from "../config/env.config";
import { AppError } from "../lib/error";

export const redis = createClient({
  url: config.REDIS_URL,
});

/**
 * Initialize redis
 */
export async function initRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

/**
 * Shutdown redis
 */
export async function shutDownRedis() {
  if (redis.isOpen) {
    await redis.quit();
  }
}

/**
 * Helper function to set data in redis
 * @param key Redis Key
 * @param value Value to be store in redis
 * @param expiration Expiration time
 */
export async function set(key: string, value: RedisArgument, expiration: number){
  try {
    await redis.set(key, value, {EX: expiration});
  } catch (e) {
    throw new AppError("Something went wrong with redis-SET", 500, e);
  }
}

/**
 * Get value from key
 * @param key Redis Key
 * @returns Value from key
 */
export async function get(key: string) {
  try {
    return await redis.get(key);
  } catch (e) {
    throw new AppError("Something went wrong with redis-GET", 500, e);
  }
}
