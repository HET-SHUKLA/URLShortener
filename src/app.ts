import { fastify, type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import { shutDownPrisma } from "./db/prisma";
import { logError } from "./lib/logger";
import { shutDownRedis } from "./db/redis";
import { ZodError } from "zod";
import { AppError } from "./lib/error";
import { badRequest, ok } from "./lib/response";
import { config } from "./config/env.config";
import healthRoutes from "./modules/health/health.routes";
import userRoutes from "./modules/users/users.routes";
import authRoutes from "./modules/auth/auth.routes";
import cookie from "@fastify/cookie";

export const buildApp = (): FastifyInstance => {
  const app = fastify({
    logger: {
      level: config.LOG_LEVEL,
      base: {
        service: "url_shortener_backend",
        env: config.NODE_ENV,
      },
    },
  });

  // Security plugins
  app.register(helmet);
  app.register(cookie, {
    secret: config.COOKIE_SECRET,
  });

  // Health route
  app.register(healthRoutes, { prefix: "/api/v1/health"});

  // App routes
  app.register(userRoutes, { prefix: "/api/v1/user"});
  app.register(authRoutes, { prefix: "/api/v1/auth"});

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
        details: config.NODE_ENV === "development" ? (error as Error)?.message : "",
      },
    });
  });

  return app;
};
