/**
 * Error Related Types
 */

import { ValidationError } from "./api.types";

export interface ErrorState {
  [field: string]: string;
}

export type AppError = string | ValidationError | ErrorState | null;
