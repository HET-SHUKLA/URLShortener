import { fastify, type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import { prisma, shutDownPrisma } from "./db/prisma";
import { logError } from "./lib/logger";
import { get, set, shutDownRedis } from "./db/redis";
import { ZodError } from "zod";
import { AppError, AuthError, NotFoundError, ValidationError } from "./lib/error";
import { badRequest, ok } from "./lib/response";
import { config } from "./config/env.config";

export const buildApp = (): FastifyInstance => {
  const app = fastify({
    logger: {
      level: config.LOG_LEVEL,
    },
  });

  // Security plugins
  app.register(helmet);

  // Testing routes
  app.get("/api/v1/health", () => {
    return { status: "ok", uptime: process.uptime() };
  });

  app.get("/api/v1/prisma", async (req, reply) => {
    try{
      const users = await prisma.user.findMany();
      return ok(reply, users);
    } catch (e) {
      throw new NotFoundError("No User found");
    }
  });

  app.get("/api/v1/redis", async (req, reply) => {
    await set("test", "Test-Value", 60);
    const redisRes = await get("test");
    return ok(reply, redisRes);
  });

  app.get<{
    Params: {type: string}
  }>("/api/v1/error/:type", (req, reply) => {
    const {type} = req.params;
    if (type === "zod") throw new ZodError([]);
    if (type === "auth") throw new AuthError("Auth error");
    if (type === "validation") throw new ValidationError("Validation error", {error: "ERROR"});
    if (type === "notfound") throw new NotFoundError("Not Found error");
    throw new NotFoundError();
  });

  app.get("/api/v1/error-auth", () => {
    throw new AuthError("Authentication Error")
  })

  // OnClose
  app.addHook("onClose", async () => {
    await shutDownPrisma();
    await shutDownRedis();
  });

  // 404 handler
  app.setNotFoundHandler((req, reply) => {
    return reply.status(404).send({
      success: false,
      error: {
        message: "Route not found",
        method: req.method,
        url: req.url,
      },
    });
  });

  // Global error handler
  app.setErrorHandler((error, req, reply) => {
    logError("Something went wrong! -> ", error);

    if (error instanceof ZodError) {
      return badRequest(reply, "Invalid data", error.issues);
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          message: error.message,
          details: error.details,
        },
      });
    }

    // Unknown errors
    return reply.status(500).send({
      success: false,
      error: {
        message: "Internal Server Error",
        details: (error as Error)?.message,
      },
    });
  });

  return app;
};
