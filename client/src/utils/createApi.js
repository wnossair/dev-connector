import axios from "axios";

export const createApi = () => {
  // Remove getStore parameter
  const api = axios.create({
    baseURL: "/api",
    timeout: 10000,
  });

  api.interceptors.request.use(
    config => {
      const token = config.token || localStorage.getItem("token");
      if (token) config.headers.Authorization = token;
      return config;
    },
    error => Promise.reject(error)
  );

  api.interceptors.response.use(
    response => response,
    error => {
      const isExpectedError = [400, 401, 404].includes(error.response?.status);
      if (!isExpectedError) console.error("API Error:", error);

      return Promise.reject({
        ...error,
        isBusinessError: isExpectedError,
      });
    }
  );

  return api;
};
