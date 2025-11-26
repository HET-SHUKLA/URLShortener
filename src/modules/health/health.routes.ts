import { FastifyInstance } from "fastify";
import {
    handleHealthCheck,
    handleErrorHealthCheck,
    handlePrismaHealthCheck,
    handleRedisHealthCheck,
} from "./health.controller"

const healthRoutes = (fastify: FastifyInstance, opts: object) => {
    // TODO: Protect health calls
    //fastify.addHook("protection", verifyToken);

    fastify.get("", handleHealthCheck);
    fastify.get("/prisma", handlePrismaHealthCheck);
    fastify.get("/redis", handleRedisHealthCheck);
    fastify.get("/error/:type", handleErrorHealthCheck);
}

export default healthRoutes;
