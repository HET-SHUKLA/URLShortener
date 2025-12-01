import { FastifyReply } from "fastify";

/**
 * Helper function to send OK response
 * @param reply FastifyReply object
 * @param data Response of a request
 * @returns FastifyReply with status and data
 */
export function ok<T>(reply: FastifyReply, message: string, data: T) {
  return reply.status(200).send({
    status: 200,
    success: true,
    message,
    data,
  });
}

/**
 * Helper function to send CREATED response
 * @param reply FastifyReply object
 * @param data Response of a request
 * @returns FastifyReply with status and data
 */
export function created<T>(reply: FastifyReply, message: string, data: T) {
  return reply.status(201).send({
    status: 201,
    success: true,
    message,
    data,
  });
}

/**
 * Helper function to send ERROR response
 * @param reply FastifyReply object
 * @param message Error message
 * @param details Optional, Error details
 * @returns FastifyReply with status and data
 */
export function badRequest(
  reply: FastifyReply,
  error: string,
  details?: unknown,
) {
  return reply.status(400).send({
    status: 400,
    success: false,
    error,
  });
}
