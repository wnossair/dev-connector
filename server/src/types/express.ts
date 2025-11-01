/**
 * Express Type Extensions
 *
 * Extends Express types to include authenticated user
 */

import { IUser } from "./models";

declare global {
  namespace Express {
    interface User extends IUser {}

    interface Request {
      user?: IUser;
    }
  }
}

export {};
