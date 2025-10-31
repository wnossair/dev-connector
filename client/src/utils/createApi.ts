import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1s initial delay

interface RetryableConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
  token?: string;
}

interface CustomAxiosError extends AxiosError {
  isBusinessError?: boolean;
}

const isRetryableError = (error: AxiosError): boolean => {
  // Retry only on network errors or 5xx server errors
  return !error.response || (error.response.status >= 500 && error.response.status < 600);
};

export const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: "/api",
    timeout: 10000,
  });

  // Request interceptor
  api.interceptors.request.use(
    (config: RetryableConfig) => {
      const token = config.token || localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Enhanced response interceptor with retry logic
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const config = error.config as RetryableConfig;
      const isExpectedError = [400, 401, 404].includes(error.response?.status || 0);

      // Set retry count if not already set
      if (!config) {
        return Promise.reject(error);
      }

      config.__retryCount = config.__retryCount || 0;

      // Check if we should retry
      if (isRetryableError(error) && config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        const delay = RETRY_DELAY * Math.pow(2, config.__retryCount - 1); // Exponential backoff

        await new Promise(resolve => setTimeout(resolve, delay));
        return api(config); // Retry the request
      }

      // Log unexpected errors (original behavior)
      if (!isExpectedError) {
        console.error("API Error:", error);
      }

      const customError: CustomAxiosError = {
        ...error,
        isBusinessError: isExpectedError,
      };

      return Promise.reject(customError);
    }
  );

  return api;
};
