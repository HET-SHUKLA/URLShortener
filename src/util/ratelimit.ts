import { FastifyBaseLogger } from "fastify";
import { redis } from "../db/redis";
import { TOO_MANY_REQUEST_ERROR } from "../constants";
import { logWarn } from "../lib/logger";
import { TooManyRequestsError } from "../lib/error";

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

export const checkIpRateLimit = async (
    logger: FastifyBaseLogger,
    ip: string,
    action: string, // e.g, "register", "login"
    {limit, windowSeconds}: RateLimitOptions,
) => {
    const key = `rt:${action}:ip:${ip}`;
    const rtResult = await checkRateLimit(key, {limit, windowSeconds});

    if (!rtResult.allowed) {
        logWarn(logger, TOO_MANY_REQUEST_ERROR, "Too many requests happened, Please try again later");

        throw new TooManyRequestsError();
    }
}