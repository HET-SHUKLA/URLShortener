// auth/auth.hook.ts
import type { FastifyPluginAsync } from "fastify";
import { checkIpRateLimit } from "../../util/ratelimit";

export const authRateLimitHook: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", async (req) => {
    let route = req.routeOptions.url?.replace(/^\//, '') ?? 'unknown';
    const ip = req.ip;
    await checkIpRateLimit(req.log, ip, route, {limit: 10, windowSeconds: 60});
  });
};
