import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { sendError } from "../utils/responseHandler.js";
import { AppError, isAppError } from "../errors/AppError.js";

/**
 * Global Error Handling Middleware
 *
 * This middleware:
 * 1. Catches all errors from route handlers (via asyncHandler)
 * 2. Logs errors for debugging and monitoring
 * 3. Converts errors to standardized API response format
 * 4. Hides sensitive details in production
 *
 * Must be registered LAST in the middleware chain (after all routes)
 */
const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error("Error caught by error handler:", {
    name: err.name,
    message: err.message,
    code: isAppError(err) ? err.code : "UNKNOWN",
    statusCode: isAppError(err) ? err.statusCode : 500,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });

  let appError: AppError;

  if (isAppError(err)) {
    // Error is already an AppError - use as is
    appError = err;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    appError = new AppError("VALIDATION_ERROR", err.message, 400);
  } else if (err.name === "CastError") {
    // Mongoose CastError (invalid ObjectId)
    appError = new AppError("INVALID_ID", "Invalid ID format", 400);
  } else if (err.name === "MongoServerError" && (err as any).code === 11000) {
    // MongoDB duplicate key error
    const field = Object.keys((err as any).keyPattern)[0] || "field";
    appError = new AppError("DUPLICATE_ENTRY", `${field} already exists`, 400, { field });
  } else {
    // Unknown error - create generic AppError
    const message =
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message || "Unknown error";
    appError = new AppError("INTERNAL_SERVER_ERROR", message, 500);
  }

  // Send error response
  sendError(res, appError.statusCode, appError.code, appError.message, appError.details);
};

export default errorHandler;
