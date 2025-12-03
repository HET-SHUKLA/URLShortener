import type { FastifyReply } from "fastify";

type LogMeta = {
  statusCode?: number,
  route?: string | undefined
}

/**
 * Helper function for logging info events
 * @param reply FastifyReply object
 * @param event Event that triggered this log
 * @param message Log message
 * @param meta Other information
 */
export const logInfo = (
  reply: FastifyReply,
  event: string,
  message: string,
  meta: LogMeta = {}
) => {
  reply.log.info({ event, ...meta }, message);
};

/**
 * Helper function for logging warning events
 * @param reply FastifyReply object
 * @param event Event that triggered this log
 * @param message Log message
 * @param meta Other information
 */
export const logWarn = (
  reply: FastifyReply,
  event: string,
  message: string,
  meta: LogMeta = {}
) => {
  reply.log.warn({ event, ...meta }, message);
};


/**
 * Helper function for logging error events
 * @param reply FastifyReply object
 * @param event Event that triggered this log
 * @param message Log message
 * @param meta Other information
 */
export const logError = (
  reply: FastifyReply,
  event: string,
  message: string,
  meta: LogMeta = {}
) => {
  reply.log.error({ event, ...meta }, message);
};