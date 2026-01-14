import { FastifyReply } from "fastify";
import { logInfo, logWarn } from "./logger";
import { HTTP_RESPONSE_BAD_REQUEST, HTTP_RESPONSE_SUCCESS } from "../constants";

interface ResponseSchemaInterface {
  status: number;
  message: string;
  success: boolean;
  data?: object
}

/**
 * Helper function to send OK response
 * @param reply FastifyReply object
 * @param data Response of a request
 * @returns FastifyReply with status and data
 */
export function ok<T>(reply: FastifyReply, message: string, data?: T) {

  logInfo(
    reply.log,
    HTTP_RESPONSE_SUCCESS,
    message,
    {
      statusCode: 200,
      route: reply.request?.routeOptions.url,
    }
  );

  return reply.status(200).send({
    status: 200,
    success: true,
    message,
    data: data ?? {},
  });
}

/**
 * Helper function to send CREATED response
 * @param reply FastifyReply object
 * @param data Response of a request
 * @returns FastifyReply with status and data
 */
export function created<T>(reply: FastifyReply, message: string, data: T) {

  logInfo(
    reply.log,
    HTTP_RESPONSE_SUCCESS,
    message,
    {
      statusCode: 201,
      route: reply.request?.routeOptions.url,
    }
  );

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
 * @returns FastifyReply with status and data
 */
export function badRequest(
  reply: FastifyReply,
  error: string,
  details?: {}
) {

  logWarn(
    reply.log,
    HTTP_RESPONSE_BAD_REQUEST,
    error,
    {
      statusCode: 400,
      route: reply.request?.routeOptions.url,
    }
  )

  return reply.status(400).send({
    status: 400,
    success: false,
    error,
    details
  });
}

export const responseSchema = (description: string, object: ResponseSchemaInterface) => {
  const baseSchema: any = {
    description,
    type: 'object',
    properties: {
      status: { type: 'number', example: object.status },
      success: { type: 'boolean', example: object.success },
    }
  }

  if (object.success) {
    baseSchema.properties.message = {
      type: 'string',
      example: object.message
    }

    if (object.data) {
      baseSchema.properties.data = object.data
    }
  } else {
    baseSchema.properties.error = {
      type: 'string',
      example: object.message
    }
  }

  return baseSchema;
};