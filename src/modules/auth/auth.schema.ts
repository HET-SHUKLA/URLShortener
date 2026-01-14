import { responseSchema } from "../../lib/response"

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

const registerBody = {
  type: 'object',
  required: ['email', 'password'],
  additionalProperties: false,
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
}

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

const registerSuccess = responseSchema("User registered success response", { status: 201, message: "User created successfully", success: true, data: registerSuccessData });

const registerResponse = {
  201: {
    headers: {
      'set-cookie': {
        type: 'string',
        description:
          'Refresh token cookie (ONLY for web clients). HttpOnly; Secure; SameSite=Lax'
      }
    },
    ...registerSuccess
  },

  400: responseSchema('Provided data is invalid', { status: 400, message: "User registered", success: false }),
  409: responseSchema('Email address already exists', { status: 409, message: "User registered", success: false }),
  500: responseSchema('Internal server error', { status: 500, message: "User registered", success: false })
}



// User registration using Email and Password
export const registerSchema = {
  tags: ['Auth'],
  summary: 'Register user with Email and Password',
  description:
    'Registers a new user. Web clients receive refresh token via HttpOnly cookie. Mobile clients receive it in response body.',
  headers: registerHeaders,
  body: registerBody,
  response: registerResponse
}



