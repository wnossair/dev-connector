import axios from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1s initial delay

const isRetryableError = error => {
  // Retry only on network errors or 5xx server errors
  return !error.response || (error.response.status >= 500 && error.response.status < 600);
};

export const createApi = () => {
  const api = axios.create({
    baseURL: "/api",
    timeout: 10000,
  });

  // Request interceptor (unchanged)
  api.interceptors.request.use(
    config => {
      const token = config.token || localStorage.getItem("token");
      if (token) config.headers.Authorization = token;
      return config;
    },
    error => Promise.reject(error)
  );

  // Enhanced response interceptor with retry logic
  api.interceptors.response.use(
    response => response,
    async error => {
      const config = error.config;
      const isExpectedError = [400, 401, 404].includes(error.response?.status);

      // Set retry count if not already set
      config.__retryCount = config.__retryCount || 0;

      // Check if we should retry
      if (isRetryableError(error) && config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        const delay = RETRY_DELAY * Math.pow(2, config.__retryCount - 1); // Exponential backoff

        await new Promise(resolve => setTimeout(resolve, delay));
        return api(config); // Retry the request
      }

      // Log unexpected errors (original behavior)
      if (!isExpectedError) console.error("API Error:", error);

      return Promise.reject({
        ...error,
        isBusinessError: isExpectedError,
      });
    }
  );

  return api;
};
