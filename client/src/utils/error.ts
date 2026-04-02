import type { AppError } from "../types";
import { useErrorStore } from "../stores/useErrorStore";

type ErrorPayload = {
  response?: {
    data?: {
      error?: {
        message?: string;
        details?: Record<string, string>;
      };
    };
  };
};

export const extractAppError = (error: unknown, fallbackMessage: string): AppError => {
  const err = error as ErrorPayload;
  const data = err.response?.data;

  if (data?.error?.details && typeof data.error.details === "object") {
    return data.error.details;
  }

  if (data?.error?.message) {
    return { message: data.error.message };
  }

  return { message: fallbackMessage };
};

export const extractErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const appError = extractAppError(error, fallbackMessage);

  if (typeof appError === "string") {
    return appError;
  }

  if (appError && typeof appError === "object") {
    if ("message" in appError && typeof appError.message === "string") {
      return appError.message;
    }

    const firstMessage = Object.values(appError).find(value => typeof value === "string");
    if (typeof firstMessage === "string") {
      return firstMessage;
    }
  }

  return fallbackMessage;
};

export const setSharedError = (error: unknown, fallbackMessage: string): void => {
  useErrorStore.getState().setError(extractAppError(error, fallbackMessage));
};

export const throwWithSharedError = (error: unknown, fallbackMessage: string): never => {
  setSharedError(error, fallbackMessage);
  throw error;
};
