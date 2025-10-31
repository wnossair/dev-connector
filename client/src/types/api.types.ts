/**
 * API Related Types
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}

export interface ValidationError {
  [field: string]: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  data: null;
  error: string | ValidationError;
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
