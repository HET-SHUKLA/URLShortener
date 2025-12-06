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
import { FAILURE_APP_ERROR } from "./constants";

export const buildApp = (): FastifyInstance => {
  const app = fastify({
    // For IP
    trustProxy: true,
    logger: {
      level: config.LOG_LEVEL,
      base: {
        service: config.SERVICE,
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

    if (error instanceof ZodError) {
      return badRequest(reply, "Invalid data", error.issues);
    }

    if (error instanceof AppError) {

      logError(
        reply,
        FAILURE_APP_ERROR,
        error.message,
        {
          statusCode: error.statusCode,
          route: reply.request?.routeOptions.url,
        }
      )

      return reply.status(error.statusCode).send({
        status: error.statusCode,
        success: false,
        error: error.message,
      });
    }

    // Unknown errors
    return reply.status(500).send({
      success: false,
      status: 500,
      error: "Something went wrong, Try again after some time",
    });
  });

  return app;
};
