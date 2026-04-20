/**
 * Express Type Extensions
 *
 * Extends Express types to include authenticated user and request-scoped logger
 */

import { IUser } from "./models";
import type { Logger } from "pino";

declare global {
  namespace Express {
    interface User extends IUser {}

    interface Request {
      user?: IUser;
      logger?: Logger;
    }
  }
}

export {};
