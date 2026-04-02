/**
 * API Related Types
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: ErrorResponse | any;
    statusText?: string;
  };
  message: string;
}

export interface AxiosRequestConfig {
  headers?: Record<string, string>;
  baseURL?: string;
  timeout?: number;
}
