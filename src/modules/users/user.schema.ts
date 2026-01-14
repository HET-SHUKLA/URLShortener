import { USER } from "../../constants";
import { responseSchema, createBodySchema, internalServerErrorResponse } from "../../lib/response";

const userSuccessData = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'User ID' },
        email: { type: 'string', format: 'email', description: 'User email address' },
        isEmailVerified: { type: 'boolean', description: 'Email verified - True / False' },
        emailVerifiedAt: { type: 'string', description: 'Email verified timestamp' },
        createdAt: { type: 'string', description: 'Created at timestamp' },
        lastLogInAt: { type: 'string', description: 'Last login timestamp' },
        signedUpUsing: { type: 'string', description: 'Signup method, e.g., GOOGLE or EMAIL' }
      }
    }
  }
}

const userMeHeader = {
  type: 'object',
  required: ['authorization'],
  properties: {
    authorization: {
      type: 'string',
      description: 'Bearer access token (Authorization: Bearer <access_token>).'
    }
  }
}

const userMeResponse = {
  200: responseSchema({ status: 200, message: "User details fetched successfully", success: true, data: userSuccessData }),
  400: responseSchema({ status: 400, message: "User ID is invalid", success: false }),
  401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
  ...internalServerErrorResponse
}

const sessionsSuccessData = {
  type: 'object',
  properties: {
    sessions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userAgent: { type: 'string', description: 'User agent string' },
          ipAddress: { type: 'string', description: 'IP address of session' },
          sessionId: { type: 'string', description: 'Session ID' }
        }
      }
    }
  }
}

const userSessionsResponse = {
  200: responseSchema({ status: 200, message: "User session fetched successfully", success: true, data: sessionsSuccessData }),
  400: responseSchema({ status: 400, message: "User ID is invalid", success: false }),
  401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
  ...internalServerErrorResponse
}

const deleteUserResponse = {
  200: responseSchema({ status: 200, message: "User deleted successfully! - 30 days to recover", success: true }),
  400: responseSchema({ status: 400, message: "User ID is invalid", success: false }),
  401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
  ...internalServerErrorResponse
}

/**
 * GET /user/me
 */
export const userMeSchema = {
  tags: [USER],
  summary: "Get user information",
  description: "Get user information from userId",
  headers: userMeHeader,
  response: userMeResponse
}

/**
 * GET /user/sessions
 */
export const userSessionsSchema = {
  tags: [USER],
  summary: "Get user sessions",
  description: "Get user sessions",
  headers: userMeHeader,
  response: userSessionsResponse
}

/**
 * DELETE /user/me
 */
export const deleteUserSchema = {
  tags: [USER],
  summary: "Delete user",
  description: "Delete user from database",
    headers: userMeHeader,
  response: deleteUserResponse
}

/**
 * GET /user/verify-email
 */
export const userVerifyEmailSchema = {
  tags: [USER],
  summary: "Send verification email",
  description: "Send email to verify user email address",
  headers: userMeHeader,
  response: {
    200: responseSchema({ status: 200, message: "Email sent successfully", success: true }),
    400: responseSchema({ status: 400, message: "User ID is invalid", success: false }),
    401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
    ...internalServerErrorResponse
  }
}
