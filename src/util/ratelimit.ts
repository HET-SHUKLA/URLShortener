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

/**
 * Helper function to check Rate limit for particular key
 * @param key Unique Id e.g, IP address
 * @param param1 RateLimitOptions object
 * @returns RateLimitResult
 */
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

/**
 * Helper function to check Rate limit of particular Ip address
 * @param logger FastifyBaseLogger instance
 * @param ip Ip address of Request
 * @param action Requested action, e.g, "register", "login" etc.
 * @param param3 RateLimitOptions object
 */
export const checkIpRateLimit = async (
    logger: FastifyBaseLogger,
    ip: string,
    {limit, windowSeconds}: RateLimitOptions,
) => {
    const key = `rt:ip:${ip}`;
    const rtResult = await checkRateLimit(key, {limit, windowSeconds});

    if (!rtResult.allowed) {
        logWarn(logger, TOO_MANY_REQUEST_ERROR, "Too many requests happened, Please try again later");

        throw new TooManyRequestsError();
    }
}