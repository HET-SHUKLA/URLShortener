/**
 * Custom application error classes
 */
export class AppError extends Error {
  statusCode: number;
  details?: unknown;
  /**
   * Creates a new AppError instance.
   * @param message - The error message.
   * @param statusCode - The HTTP status code associated with the error.
   * @param details - Additional details about the error.
   */
  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
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
   * @param message - The error message.
   */
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

/**
 * Authentication Error class
 */
export class AuthError extends AppError {
  /**
   * Creates a new AuthError instance.
   * @param message - The error message.
   */
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/**
 * Validation Error class
 */
export class ValidationError extends AppError {
  /**
   * Creates a new ValidationError instance.
   * @param message - The error message.
   * @param details - Additional details about the validation error.
   */
  constructor(message = "Invalid data", details?: unknown) {
    super(message, 400, details);
  }
}
