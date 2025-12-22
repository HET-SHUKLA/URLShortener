// auth/auth.hook.ts
import type { FastifyPluginAsync } from "fastify";
import { checkIpRateLimit } from "../../util/ratelimit";

/**
 * Hook for implementing rate limit to the /auth routes
 * @param fastify Fastify Instance
 */
export const authRateLimitHook: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", async (req) => {
    let route = req.routeOptions.url ?? 'unknown';
    const ip = req.ip;
    await checkIpRateLimit(req.log, ip, route, {limit: 10, windowSeconds: 60});
  });
};
