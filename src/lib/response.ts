import { FastifyReply } from "fastify";

/**
 * Helper function to send OK response
 * @param reply FastifyReply object
 * @param data Response of a request
 * @returns FastifyReply with status and data
 */
export function ok<T>(reply: FastifyReply, data: T) {
    return reply.status(200).send({
        success: true,
        data,
    });
}

/**
 * Helper function to send CREATED response
 * @param reply FastifyReply object
 * @param data Response of a request
 * @returns FastifyReply with status and data
 */
export function created<T>(reply: FastifyReply, data: T) {
    return reply.status(201).send({
        success: true,
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
export function badRequest(reply: FastifyReply, message: string, details?: unknown) {
    return reply.status(400).send({
        success: false,
        error: { message, details },
    });
}

