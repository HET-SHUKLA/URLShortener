// auth/auth.hook.ts
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { checkIpRateLimit } from "../../util/ratelimit";
import { config } from "../../config/env.config";

/**
 * Hook for implementing rate limit to the /auth routes
 * @param fastify Fastify Instance
 */
export const authRateLimitHook = async (req: FastifyRequest, reply: FastifyReply) => {
  const ip = req.ip;
  await checkIpRateLimit(req.log, ip, {limit: config.NODE_ENV === "development" ? 100 : 10, windowSeconds: 60});
};
