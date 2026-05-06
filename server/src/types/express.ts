/**
 * Express Type Extensions
 *
 * Extends Express types to include authenticated user and request-scoped logger
 */

import { IUser } from "./models";
import type { Logger } from "pino";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends IUser {}

    interface Request {
      user?: IUser;
      logger?: Logger;
    }
  }
}

export {};
