import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * AsyncHandler Middleware
 * Higher-order function that wraps async route handlers
 * Automatically catches any errors and passes them to the error handler middleware
 *
 * This eliminates the need for try/catch blocks in every route handler.
 * Any thrown error (including custom AppError classes) will be caught and passed to the error handler.
 *
 * Usage:
 * router.get("/profile", asyncHandler(async (req, res) => {
 *   const profile = await Profile.findOne(...);
 *   if (!profile) throw new NotFoundError("Profile");
 *   res.json(sendSuccess(res, 200, "Profile fetched", { profile }));
 * }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
