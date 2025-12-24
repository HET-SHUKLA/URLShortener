import { FastifyReply, FastifyRequest } from "fastify";
import { ok } from "../../lib/response";
import { ZodError } from "zod";
import { AuthError, NotFoundError, ValidationError } from "../../lib/error";
import { prisma } from "../../db/prisma";
import { get, set } from "../../db/redis";

const handleHealthCheck = (req: FastifyRequest, reply: FastifyReply) => {
    return ok(reply, "Health route",{data: process.uptime()});
}

const handleErrorHealthCheck = (req: FastifyRequest<{ Params: {type: string}}>, reply: FastifyReply) => {
    const { type } = req.params;
    if (type === "zod") throw new ZodError([]);
    if (type === "auth") throw new AuthError("Auth error");
    if (type === "validation") throw new ValidationError("Validation error", {error: "ERROR"});
    if (type === "notfound") throw new NotFoundError("Not Found error");
    throw new NotFoundError();
}

const handlePrismaHealthCheck = async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await prisma.user.findMany();
    return ok(reply, "Health route", users);
}

const handleRedisHealthCheck = async (req: FastifyRequest, reply: FastifyReply) => {
    await set("test", "Test-Value", 60);
    const redisRes = await get("test");
    return ok(reply, "Health route", redisRes);
}

export {
    handleHealthCheck,
    handleErrorHealthCheck,
    handlePrismaHealthCheck,
    handleRedisHealthCheck,
}