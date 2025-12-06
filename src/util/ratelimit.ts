import { redis } from "../db/redis";

export interface RateLimitOptions {
    limit: number;
    windowSeconds: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    limit: number;
    retryAfterSeconds?: number;
}

export const checkRateLimit = async (
    key: string, // unique id e.g, IP
    {limit, windowSeconds}: RateLimitOptions,
): Promise<RateLimitResult> => {
    
}