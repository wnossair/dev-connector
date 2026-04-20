import { Response } from "express";
import { Result, ValidationError } from "express-validator";
import { IApiResponse } from "../types/index.js";

/**
 * Sends a standardized success response.
 *
 * @param res Express Response object
 * @param statusCode HTTP status code (200, 201, etc.)
 * @param message User-friendly success message
 * @param data Response data
 */
export const sendSuccess = <T = unknown>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null,
): void => {
  const response: IApiResponse<T> = {
    success: true,
    message,
    data: data ?? undefined,
    timestamp: new Date().toISOString(),
    path: res.req?.path,
  };
  res.status(statusCode).json(response);
};

/**
 * Sends a standardized error response with error code.
 *
 * @param res Express Response object
 * @param statusCode HTTP status code
 * @param code Machine-readable error code (e.g., "VALIDATION_ERROR")
 * @param message User-friendly error message
 * @param details Field-level errors or additional context
 */
export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
): void => {
  const response: IApiResponse = {
    success: false,
    error: {
      code,
      message,
      details: details ?? undefined,
    },
    timestamp: new Date().toISOString(),
    path: res.req?.path,
  };
  res.status(statusCode).json(response);
};

/**
 * Converts express-validator errors to field error object.
 * Used primarily for structured error handling.
 *
 * @param errors ValidationError result from express-validator
 * @returns Object with field names as keys and error messages as values
 */
export const getValidationErrorsObject = (
  errors: Result<ValidationError>,
): Record<string, string> => {
  return errors.array().reduce(
    (acc, curr) => {
      if ("path" in curr && typeof curr.path === "string") {
        acc[curr.path] = curr.msg;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
};

/**
 * Sends a standardized 400 validation error response.
 *
 * @param res Express Response object
 * @param errors ValidationError result from express-validator
 * @param message Optional user-friendly message (defaults to "Validation failed")
 */
export const handleValidationErrors = (
  res: Response,
  errors: Result<ValidationError>,
  message = "Validation failed",
): void => {
  sendError(res, 400, "VALIDATION_ERROR", message, getValidationErrorsObject(errors));
};
