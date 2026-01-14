import { URL } from "../../constants";
import { responseSchema, createBodySchema, internalServerErrorResponse } from "../../lib/response";

const authHeaderOptional = {
  type: 'object',
  additionalProperties: false,
  properties: {
    authorization: { type: 'string', description: 'Bearer access token (Authorization: Bearer <access_token>)' }
  }
}

const authHeaderRequired = {
  type: 'object',
  additionalProperties: false,
  required: ['authorization'],
  properties: {
    authorization: { type: 'string', description: 'Bearer access token (Authorization: Bearer <access_token>)' }
  }
}

const postUrlBody = createBodySchema({
  description: "Create short URL",
  required: ['longUrl'],
  properties: {
    longUrl: { type: 'string', format: 'uri', description: 'Original long URL' },
    protectionMethod: { type: 'string', description: 'Protection method for URL' },
    urlPassword: { type: 'string', description: 'Password if protection method is PASSWORD' },
    isUrlSFW: { type: 'boolean', description: 'Is URL safe for work' },
    isAnalyticsEnabled: { type: 'boolean', description: 'Enable analytics for this URL' },
    emailNotificationEnable: { type: 'boolean', description: 'Enable email notifications for URL' },
    customAlias: { type: 'string', description: 'Custom alias for short URL' }
  }
});

const postUrlSuccessData = {
  type: 'object',
  properties: {
    shortUrl: { type: 'string', description: 'Generated short URL code' }
  }
}

const postUrlResponse = {
  201: responseSchema({ status: 201, message: "URL shorted successfully", success: true, data: postUrlSuccessData }),
  400: responseSchema({ status: 400, message: "Invalid Data", success: false }),
  401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
  ...internalServerErrorResponse
}

const getUrlProtectedData = {
  type: 'object',
  properties: {
    protectionMethod: { type: 'string', description: 'Protection method if enabled' }
  }
}

const getUrlResponse = {
  200: responseSchema({ status: 200, message: "Long URL fetched success fully / Protected URL", success: true, data: getUrlProtectedData }),
  302: responseSchema({ status: 302, message: "Redirecting user to original URL", success: true }),
  401: responseSchema({ status: 401, message: "This URL is protected", success: false }),
  404: responseSchema({ status: 404, message: "URL code does not exists", success: false }),
  ...internalServerErrorResponse
}

const getUrlInfoData = {
  type: 'object',
  properties: {
    url: {
      type: 'object',
      properties: {
        longUrl: { type: 'string', format: 'uri' },
        protectionMethod: { type: 'string' },
        protectedPassword: { type: 'string' },
        isUrlSFW: { type: 'boolean' },
        isAnalyticsEnabled: { type: 'boolean' },
        emailNotificationEnable: { type: 'boolean' },
        totalClicks: { type: 'number' },
        totalSuccessClicks: { type: 'number' },
        createdAt: { type: 'string' },
        lastUpdatedAt: { type: 'string' }
      }
    }
  }
}

const getUrlInfoResponse = {
  200: responseSchema({ status: 200, message: "URL data fetched successfully", success: true, data: getUrlInfoData }),
  400: responseSchema({ status: 400, message: "Invalid Data", success: false }),
  401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
  ...internalServerErrorResponse
}

const statsData = {
  type: 'object',
  properties: {
    stats: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          success: { type: 'boolean' },
          ip: { type: 'string' },
          method: { type: 'string' },
          time: { type: 'string' }
        }
      }
    }
  }
}

const getStatsResponse = {
  200: responseSchema({ status: 200, message: "URL analytics fetched successfully", success: true, data: statsData }),
  401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
  404: responseSchema({ status: 404, message: "Url not found", success: false }),
  ...internalServerErrorResponse
}

const deleteUrlResponse = {
  200: responseSchema({ status: 200, message: "URL deleted successfully", success: true }),
  400: responseSchema({ status: 400, message: "Invalid Data", success: false }),
  401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
  ...internalServerErrorResponse
}

/**
 * POST /url
 */
export const postUrlSchema = {
  tags: [URL],
  summary: "Create short URL",
  description: "Create short URL",
  body: postUrlBody,
  headers: authHeaderOptional,
  response: postUrlResponse
}

/**
 * GET /url/:id
 */
export const getUrlSchema = {
  tags: [URL],
  summary: "Get long URL or Get Protection method",
  description: "Get long URL or protection method based on URL code",
  response: getUrlResponse
}

/**
 * GET /url/get/:id
 */
export const getUrlInfoSchema = {
  tags: [URL],
  summary: "Get URL information",
  description: "Get URL information (requires auth)",
  headers: authHeaderRequired,
  response: getUrlInfoResponse
}

/**
 * GET /url/stats/:id
 */
export const getUrlStatsSchema = {
  tags: [URL],
  summary: "Get URL analytics",
  description: "Get URL analytics (paginated)",
  headers: authHeaderRequired,
  response: getStatsResponse
}

/**
 * DELETE /url/:id
 */
export const deleteUrlSchema = {
  tags: [URL],
  summary: "Delete URL",
  description: "Delete URL",
  headers: authHeaderRequired,
  response: deleteUrlResponse
}
