const loginBody = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'User email address'
    },
    password: {
      type: 'string',
      minLength: 8,
      description: 'User password'
    }
  }
}

const loginResponse = {
  200: {
    description: 'Authentication successful',
    type: 'object',
    properties: {
      accessToken: { type: 'string' }
    }
  }
}

export const loginSchema = {
  tags: ['Auth'],
  summary: 'Authenticate user',
  body: loginBody,
  response: loginResponse
}
