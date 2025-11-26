import { FastifyReply, FastifyRequest } from "fastify";
import { ok } from "../../lib/response";
import { ZodError } from "zod";
import { AuthError, NotFoundError, ValidationError } from "../../lib/error";
import { prisma } from "../../db/prisma";
import { get, set } from "../../db/redis";

const handleHealthCheck = (req: FastifyRequest, reply: FastifyReply) => {
    req.log.info("[INFO] HEALTH LOG");
    return ok(reply, {data: process.uptime()});
}

const handleErrorHealthCheck = (req: FastifyRequest<{ Params: {type: string}}>, reply: FastifyReply) => {
    const { type } = req.params;
    req.log.error("[ERROR] ERROR LOG")
    if (type === "zod") throw new ZodError([]);
    if (type === "auth") throw new AuthError("Auth error");
    if (type === "validation") throw new ValidationError("Validation error", {error: "ERROR"});
    if (type === "notfound") throw new NotFoundError("Not Found error");
    throw new NotFoundError();
}

const handlePrismaHealthCheck = async (req: FastifyRequest, reply: FastifyReply) => {
    req.log.info("[INFO] PRISMA LOG")
    const users = await prisma.user.findMany();
    return ok(reply, users);
}

const handleRedisHealthCheck = async (req: FastifyRequest, reply: FastifyReply) => {
    req.log.info("[INFO] REDIS LOG")
    await set("test", "Test-Value", 60);
    const redisRes = await get("test");
    return ok(reply, redisRes);
}

export {
    handleHealthCheck,
    handleErrorHealthCheck,
    handlePrismaHealthCheck,
    handleRedisHealthCheck,
}