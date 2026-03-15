/**
 * Validation Middleware
 * Validates request body using express-validator and throws ValidationError on failure
 */

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationError } from "../errors/AppError.js";
import { getValidationErrorsObject } from "../utils/responseHandler.js";

/**
 * Middleware to handle validation errors from express-validator
 * Should be used after validation rules in route handlers
 *
 * Usage:
 * router.post(
 *   "/login",
 *   loginValidation,
 *   validateRequest,
 *   asyncHandler(async (req, res) => { ... })
 * );
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const fieldErrors = getValidationErrorsObject(errors);
    throw new ValidationError(fieldErrors);
  }

  next();
};
