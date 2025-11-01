import { Response } from "express";
import { Result, ValidationError } from "express-validator";
import { IApiResponse } from "../types/index.js";

/**
 * Sends a standardized success response.
 */
export const sendSuccess = <T = any>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null
): void => {
  const response: IApiResponse<T> = {
    success: true,
    message,
    data: data ?? undefined,
    error: undefined,
  };
  res.status(statusCode).json(response);
};

/**
 * Sends a standardized error response.
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errorDetails: string | Record<string, any> | null = null
): void => {
  const response: IApiResponse = {
    success: false,
    message,
    data: null,
    error: errorDetails ?? undefined,
  };
  res.status(statusCode).json(response);
};

/**
 * Handles validation errors from express-validator.
 */
export const handleValidationErrors = (
  res: Response,
  errors: Result<ValidationError>,
  message: string = "Validation failed"
): void => {
  const errorsObject = errors.array().reduce((acc, curr) => {
    if ("path" in curr && typeof curr.path === "string") {
      acc[curr.path] = curr.msg;
    }
    return acc;
  }, {} as Record<string, string>);

  sendError(res, 400, message, errorsObject);
};
