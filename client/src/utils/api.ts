import { AxiosResponse, AxiosError } from "axios";
import { createApi } from "./createApi";
import { logger } from "./logger";

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
        // Only auto-logout if the user is already authenticated (e.g. expired token).
        // Login failures also return 401 but the user was never authenticated.
        import("../stores/useAuthStore")
          .then(({ useAuthStore }) => {
            if (useAuthStore.getState().isAuthenticated) {
              logger.warn("Received 401 for authenticated session; forcing logout");
              useAuthStore.getState().logout();
              import("../stores/useProfileStore")
                .then(({ useProfileStore }) => {
                  useProfileStore.getState().clearProfile();
                })
                .catch(importError => {
                  logger.error("Failed to load profile store for 401 cleanup", importError);
                });
            }
          })
          .catch(importError => {
            logger.error("Failed to load auth store for 401 handling", importError);
          });
      }
      return Promise.reject(error);
    },
  );
};
