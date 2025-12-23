// auth/auth.hook.ts
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { checkIpRateLimit } from "../../util/ratelimit";

/**
 * Hook for implementing rate limit to the /auth routes
 * @param fastify Fastify Instance
 */
export const authRateLimitHook = async (req: FastifyRequest, reply: FastifyReply) => {
  const ip = req.ip;
  await checkIpRateLimit(req.log, ip, {limit: 10, windowSeconds: 60});
};
