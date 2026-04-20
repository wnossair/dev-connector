/**
 * API Related Types
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ValidationError {
  [field: string]: string;
}

export interface ApiErrorDetails {
  [field: string]: string;
}

export interface ApiErrorEnvelope {
  code: string;
  message: string;
  details?: ApiErrorDetails;
}

export interface ErrorResponse {
  success: false;
  error: ApiErrorEnvelope;
}

export interface ApiError {
  response?: {
    status: number;
    data?: ErrorResponse | unknown;
    statusText?: string;
  };
  message: string;
}

export interface AxiosRequestConfig {
  headers?: Record<string, string>;
  baseURL?: string;
  timeout?: number;
}
