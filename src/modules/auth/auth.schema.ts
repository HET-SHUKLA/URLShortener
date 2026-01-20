import { AUTH } from "../../constants";
import { createBodySchema, internalServerErrorResponse, responseSchema } from "../../lib/response"

const registerHeaders = {
  type: 'object',
  required: ['x-client-type'],
  properties: {
    'x-client-type': {
      type: 'string',
      enum: ['web', 'mobile'],
      description: 'Client type. Affects refresh token delivery (cookie for web, body for mobile).'
    },
    'user-agent': {
      type: 'string',
      description: 'Optional user agent string',
    }
  }
}

const registerBody = createBodySchema({
  description: "User registration using Email and Password",
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address'
    },
    password: {
      type: 'string',
      minLength: 8,
      description: 'User password (minimum 8 characters)'
    }
  }
})

const registerSuccessData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'User ID'
    },
    accessToken: {
      type: 'string',
      description: 'JWT access token'
    },
    refreshToken: {
      type: 'string',
      nullable: true,
      description: 'Refresh token (ONLY for mobile clients)'
    }
  }
}

const registerSuccess = responseSchema({ status: 201, message: "User created successfully", success: true, data: registerSuccessData });

const registerResponse = {
  201: {
    headers: {
      'set-cookie': {
        type: 'string',
        description:
          'Refresh token cookie (ONLY for web clients). HttpOnly, Secure, SameSite=Lax'
      }
    },
    ...registerSuccess
  },

  400: responseSchema({ status: 400, message: "Provided data is invalid", success: false }),
  409: responseSchema({ status: 409, message: "Email address already exists", success: false }),
  ...internalServerErrorResponse
}

const googleLoginSuccess = responseSchema({ status: 200, message: "User logged in successfully", success: true, data: registerSuccessData })

const googleBody = createBodySchema({
  description: "Register / Login user using Google",
  properties: {
    idToken: {
      type: 'string',
      description: 'Google id token'
    },
  }
});

const googleResponse = {
  200: {
    headers: {
      'set-cookie': {
        type: 'string',
        description:
          'Refresh token cookie (ONLY for web clients). HttpOnly, Secure, SameSite=Lax'
      }
    },
    ...googleLoginSuccess
  },

  201: {
    headers: {
      'set-cookie': {
        type: 'string',
        description:
          'Refresh token cookie (ONLY for web clients). HttpOnly, Secure, SameSite=Lax'
      }
    },
    ...registerSuccess
  },

  400: responseSchema({ status: 400, message: "Google ID is invalid", success: false }),
  ...internalServerErrorResponse
}

const refreshHeader = {
  type: 'object',
  additionalProperties: false,
  properties: {
    cookie: {
      type: 'string',
      description: 'Web clients only. Must contain refreshToken cookie (refreshToken=<jwt>).'
    },
    authorization: {
      type: 'string',
      description: 'Mobile clients only. Bearer refresh token (Authorization: Bearer <refresh_token>).'
    }
  }
}

const authHeader = {
  type: 'object',
  additionalProperties: false,
  required: ['authorization'],
  properties: {
    authorization: {
      type: 'string',
      description: 'Bearer access token (Authorization: Bearer <access_token>).'
    }
  }
}

const refreshSuccess = responseSchema({ status: 200, message: "Token refreshed", success: true, data: registerSuccessData })

const refreshResponse = {
  200: {
    headers: {
      'set-cookie': {
        type: 'string',
        description:
          'Refresh token cookie (ONLY for web clients). HttpOnly, Secure, SameSite=Lax'
      }
    },
    ...refreshSuccess
  },

  400: responseSchema({ status: 400, message: "Provided data is invalid", success: false }),
  401: responseSchema({ status: 401, message: "Token is either expired or invalid", success: false }),
  ...internalServerErrorResponse
}

const loginSuccess = responseSchema({ status: 200, message: "User logged in successfully", success: true, data: registerSuccessData })

const loginResponse = {
  200: {
    headers: {
      'set-cookie': {
        type: 'string',
        description:
          'Refresh token cookie (ONLY for web clients). HttpOnly, Secure, SameSite=Lax'
      }
    },
    ...loginSuccess
  },

  400: responseSchema({ status: 400, message: "Provided data is invalid", success: false }),
  401: responseSchema({ status: 401, message: "Email or Password is incorrect", success: false }),
  ...internalServerErrorResponse
}

const meSuccessData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'User ID'
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'User Email Address'
    },
    emailVerified: {
      type: 'boolean',
      description: 'Email verified - True / False'
    },
    accountType: {
      type: 'string',
      description: 'Type of an account',
      example: 'GOOGLE'
    }
  }
}

const meResponse = {
  200: responseSchema({ status: 200, message: "User details fetched successfully", success: true, data: meSuccessData }),
  400: responseSchema({ status: 400, message: "Token is invalid", success: false }),
  401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
  ...internalServerErrorResponse
}

const logoutHeader = {
  type: 'object',
  additionalProperties: false,
  properties: {
    authorization: {
      type: 'string',
      description: 'Bearer refresh token(Authorization: Bearer <refresh_token>).'
    }
  }
}

const logoutResponse = {
  200: responseSchema({ status: 200, message: "User logged out successfully", success: true }),
  400: responseSchema({ status: 400, message: "Token is invalid", success: false }),
  401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
  ...internalServerErrorResponse
}

/**
 * POST auth/register
 */
export const registerSchema = {
  tags: [AUTH],
  summary: 'Register user with Email and Password',
  description:
    'Registers a new user. Web clients receive refresh token via HttpOnly cookie. Mobile clients receive it in response body.',
  headers: registerHeaders,
  body: registerBody,
  response: registerResponse
}

/**
 * POST auth/google
 */
export const googleSchema = {
  tags: [AUTH],
  summary: "Register / Login using Google",
  description: "Register / Login user using Google id token. Web clients receive refresh token via HttpOnly cookie. Mobile clients receive it in response body.",
  body: googleBody,
  response: googleResponse
}

/**
 * POST auth/refresh
 */
export const refreshSchema = {
  tags: [AUTH],
  summary: "Get new Access Token",
  description: "Get new Access Token when old one gets expired.",
  headers: refreshHeader,
  response: refreshResponse
}

/**
 * POST auth/login
 */
export const loginSchema = {
  tags: [AUTH],
  summary: "Login user with Email and Password",
  description: "Login user with Email and Password",
  headers: registerHeaders,
  body: registerBody,
  response: loginResponse
}

/**
 * GET auth/me
 */
export const meSchema = {
  tags: [AUTH],
  summary: "Returns current user information",
  description: "Get current user information using Access token",
  headers: authHeader,
  response: meResponse
}

/**
 * DELETE auth/logout
 */
export const logoutSchema = {
  tags: [AUTH],
  summary: "Logout user",
  description: "Logout user",
  headers: logoutHeader,
  response: logoutResponse
}

/**
 * DELETE auth/logout/:sessionId
 */
export const logoutSessionSchema = {
  tags: [AUTH],
  summary: "Logout user from specific session",
  description: "Logout user from specific session",
  headers: logoutHeader,
  params: {
    type: 'object',
    required: ['sessionId'],
    properties: {
      sessionId: { type: 'string', description: 'Session ID to invalidate' }
    }
  },
  response: {
    200: responseSchema({ status: 200, message: "User logged out successfully from given session", success: true }),
    400: responseSchema({ status: 400, message: "Session ID is invalid", success: false }),
    401: responseSchema({ status: 401, message: "Token is expired or invalid", success: false }),
    ...internalServerErrorResponse
  }
}



