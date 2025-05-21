import { sendError } from "../utils/responseHandler.js";

/**
 * Global error handling middleware.
 * Catches errors and sends a standardized JSON response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error("ErrorHandler caught an error:", err);

  const statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected error occurred";
  let errorDetails = err.errors || err.message;

  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Internal Server Error";
    // In production, do not send stack trace or overly detailed internal errors
    errorDetails = "Internal Server Error";
  } else if (process.env.NODE_ENV !== "production" && err.stack && !err.errors) {
    // Provide stack in development if no specific 'errors' array exists (e.g., from validation)
    errorDetails = err.stack;
  }

  // If it's a known error structure (like from validation) it might have `err.errors`
  // Otherwise, use the error message or stack for details.
  sendError(res, statusCode, message, errorDetails);
};

export default errorHandler;
