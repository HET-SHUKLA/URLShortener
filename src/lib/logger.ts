import type { FastifyBaseLogger } from "fastify";
import pino from 'pino';
import { config } from "../config/env.config";

type LogMeta = Record<string, unknown>

/**
 * Base logger to log outside HTTP request
 */
export const baseLogger = pino({
  level: config.LOG_LEVEL,
  base: {
    service: config.SERVICE,
    env: config.NODE_ENV,
  },
});

/**
 * Helper function for logging info events
 * @param logger FastifyBaseLogger object
 * @param event Event that triggered this log
 * @param message Log message
 * @param meta Other information
 */
export const logInfo = (
  logger: FastifyBaseLogger,
  event: string,
  message: string,
  meta:LogMeta = {}
) => {
  logger.info({ event, ...meta }, message);
};

/**
 * Helper function for logging warning events
 * @param logger FastifyBaseLogger object
 * @param event Event that triggered this log
 * @param message Log message
 * @param meta Other information
 */
export const logWarn = (
  logger: FastifyBaseLogger,
  event: string,
  message: string,
  meta:LogMeta = {}
) => {
  logger.warn({ event, ...meta }, message);
};


/**
 * Helper function for logging error events
 * @param logger FastifyBaseLogger object
 * @param event Event that triggered this log
 * @param message Log message
 * @param meta Other information
 */
export const logError = (
  logger: FastifyBaseLogger,
  event: string,
  message: string,
  meta:LogMeta = {}
) => {
  logger.error({ event, ...meta }, message);
};