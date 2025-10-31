import { AxiosResponse, AxiosError } from "axios";
import { createApi } from "./createApi";

// Create basic API instance without store dependency
export const api = createApi();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Store = any; // Will be properly typed when store.ts is converted

/**
 * Function to add store dependency after store is created
 * This allows the API to dispatch Redux actions on 401 errors
 */
export const injectStore = (store: Store): void => {
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        store.dispatch({ type: "auth/logoutUser" });
        store.dispatch({ type: "profile/clearProfile" });
      }
      return Promise.reject(error);
    }
  );
};
