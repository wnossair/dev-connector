import { AxiosResponse, AxiosError } from "axios";
import { createApi } from "./createApi";

// Create basic API instance
export const api = createApi();

/**
 * Setup API interceptors for handling auth errors
 * This will be called during app initialization
 */
export const setupApiInterceptors = (): void => {
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Dynamically import stores to avoid circular dependencies
        import("../stores/useAuthStore").then(({ useAuthStore }) => {
          useAuthStore.getState().logout();
        });
        import("../stores/useProfileStore").then(({ useProfileStore }) => {
          useProfileStore.getState().clearProfile();
        });
      }
      return Promise.reject(error);
    }
  );
};
