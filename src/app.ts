import { fastify, type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import { shutDownPrisma } from "./db/prisma";
import { logError } from "./lib/logger";
import { shutDownRedis } from "./db/redis";
import { ZodError } from "zod";
import { AppError } from "./lib/error";
import { badRequest } from "./lib/response";

export const buildApp = (): FastifyInstance => {
  const app = fastify({
    logger: true,
  });

  // Security plugins
  app.register(helmet);

  app.get("/health", () => {
    return { status: "ok", uptime: process.uptime() };
  });

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
