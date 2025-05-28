/**
 * Sends a standardized success response.
 * @param {object} res - Express response object.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Human-readable success message.
 * @param {object|array|null} data - The payload of the response.
 */
export const sendSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    error: null,
  });
};

/**
 * Sends a standardized error response.
 * @param {object} res - Express response object.
 * @param {number} statusCode - HTTP status code.
 * @param {string} message - Human-readable error message.
 * @param {object|array|string|null} errorDetails - Specific error details (e.g., validation errors array, error message string).
 */
export const sendError = (res, statusCode, message, errorDetails = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: errorDetails,
  });
};

/**
 * Handles validation errors from express-validator.
 * @param {object} res - Express response object.
 * @param {Result<ValidationError>} errors - The validation errors object from express-validator.
 * @param {string} message - Optional custom message for the validation failure.
 */
export const handleValidationErrors = (res, errors, message = "Validation failed") => {
  const errorsObject = errors.array().reduce((acc, curr) => {
    acc[curr.path] = curr.msg;
    return acc;
  }, {});

  return sendError(res, 400, message, errorsObject);
};
