import { redis } from "../db/redis";

export interface RateLimitOptions {
    limit: number;
    windowSeconds: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    limit: number;
}

export const checkRateLimit = async (
    key: string, // unique id e.g, IP
    {limit, windowSeconds}: RateLimitOptions,
): Promise<RateLimitResult> => {
    const count = await redis.incr(key);
    if (count === 1) {
        await redis.expire(key, windowSeconds);
    }

    const remaining = limit - count;
    const isAllowed = remaining > 0;

    return {
        allowed: isAllowed,
        remaining,
        limit,
    }
}