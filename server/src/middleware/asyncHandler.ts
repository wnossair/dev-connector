import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Async handler wrapper to catch errors in async route handlers
 * and pass them to the error middleware
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
