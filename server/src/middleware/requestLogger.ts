import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { withContext } from "../utils/logger.js";

/**
 * Request Logger Middleware
 *
 * Generates or extracts request ID and creates a request-scoped child logger.
 * Every log line for this request will automatically include the request ID,
 * enabling full request tracing across middleware/routes/services.
 *
 * This middleware must be placed early in the middleware chain, before routes.
 */
export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Extract request ID from header or generate a new one
  const requestId =
    (req.get("x-request-id") as string | undefined) ||
    (req.get("x-correlation-id") as string | undefined) ||
    randomUUID();

  // Create a child logger with request ID context
  req.logger = withContext({
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip || req.socket.remoteAddress,
  });

  // Attach request ID to response headers for client-side tracing
  res.setHeader("x-request-id", requestId);

  // Log request start (only in debug mode to reduce noise)
  req.logger.debug("Request received");

  // Call next middleware
  next();
};
