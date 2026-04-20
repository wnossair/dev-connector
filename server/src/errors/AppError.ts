/**
 * Custom Error Classes for Dev Connector
 * Provides type-safe error handling with error codes
 */

/**
 * Base Application Error Class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;
  public readonly isOperational: boolean = true;

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation Error - 400
 * Used when request data fails validation
 */
export class ValidationError extends AppError {
  constructor(details: Record<string, string>) {
    super("VALIDATION_ERROR", "Validation failed", 400, details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Authentication Error - 401
 * Used when user is not authenticated
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super("AUTHENTICATION_ERROR", message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization Error - 403
 * Used when user doesn't have permission
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "You do not have permission to perform this action") {
    super("AUTHORIZATION_ERROR", message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Not Found Error - 404
 * Used when resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super("NOT_FOUND", `${resource} not found`, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Duplicate Entry Error - 400
 * Used when trying to create a duplicate unique field
 */
export class DuplicateError extends AppError {
  constructor(field: string, value?: string) {
    const message = value ? `${field} '${value}' already exists` : `${field} already exists`;
    super("DUPLICATE_ENTRY", message, 400, { field, value });
    Object.setPrototypeOf(this, DuplicateError.prototype);
  }
}

/**
 * Conflict Error - 409
 * Used for state conflicts (e.g., already liked, already following)
 */
export class ConflictError extends AppError {
  constructor(message: string = "This action conflicts with the current state") {
    super("CONFLICT", message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Rate Limit Error - 429
 * Used when rate limit is exceeded
 */
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests, please try again later") {
    super("RATE_LIMIT_EXCEEDED", message, 429);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Internal Server Error - 500
 * Used for unexpected server errors
 */
export class InternalServerError extends AppError {
  constructor(message: string = "An unexpected error occurred") {
    super("INTERNAL_SERVER_ERROR", message, 500);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * Database Error - 500
 * Used for database operation failures
 */
export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super("DATABASE_ERROR", message, 500);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * External Service Error - 502/503
 * Used when external services (GitHub, etc.) fail
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, statusCode: number = 502, message?: string) {
    const msg = message || `${service} service is unavailable`;
    super("EXTERNAL_SERVICE_ERROR", msg, statusCode, { service });
    Object.setPrototypeOf(this, ExternalServiceError.prototype);
  }
}

/**
 * Type guard to check if error is an AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};
