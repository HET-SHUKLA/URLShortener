import type { FastifyBaseLogger } from "fastify";

type LogMeta = Record<string, unknown>

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