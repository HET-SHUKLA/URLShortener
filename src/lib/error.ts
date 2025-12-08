/**
 * Custom application error classes
 */
export class AppError extends Error {
  statusCode: number;
  details?: unknown;
  /**
   * Creates a new AppError instance.
   * @param error - The error message.
   * @param statusCode - The HTTP status code associated with the error.
   * @param details - Additional details about the error.
   */
  constructor(error: string, statusCode = 500, details?: unknown) {
    super(error);
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Not Found Error class
 */
export class NotFoundError extends AppError {
  /**
   * Creates a new NotFoundError instance.
   * @param error - The error message.
   */
  constructor(error = "Not Found") {
    super(error, 404);
  }
}

/**
 * Authentication Error class
 */
export class AuthError extends AppError {
  /**
   * Creates a new AuthError instance.
   * @param error - The error message.
   */
  constructor(error = "Unauthorized") {
    super(error, 401);
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends AppError {
  /**
   * Creates a new ValidationError instance.
   * @param error Error message 
   * @param details Details of the error, If any
   */
  constructor(error = "Invalid data", details?: unknown) {
    super(error, 400, details);
  }
}


/**
 * Internal server error
 */
export class InternalServerError extends AppError {

  /**
   * Create new InternalServerError instance
   * @param error Error message 
   * @param details Details of the error, If any
   */
  constructor(error = "Something went wrong, Try again after some time", details?: unknown) {
    super(error, 500, details);
  }
}

/**
 * Conflict error
 */
export class ConflictError extends AppError {

  /**
   * Create new ConflictError instance
   * @param error Error message 
   * @param details Details of the error, If any
   */
  constructor(error = "Conflict error", details?: unknown) {
    super(error, 409, details);
  }
}

/**
 * Too many requests error
 */
export class TooManyRequestsError extends AppError {

  /**
   * Create new TooManyRequestsError instance
   * @param error Error message
   * @param details Details of the error, If any
   */
  constructor(error = "Too Many requests", details?: unknown) {
    super(error, 429, details);
  }
}