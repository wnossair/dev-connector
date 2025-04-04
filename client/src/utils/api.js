import { createApi } from "./createApi";

// Create basic API instance without store dependency
export const api = createApi();

// Function to add store dependency after store is created
export const injectStore = store => {
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        store.dispatch({ type: "auth/logoutUser" });
        store.dispatch({ type: "profile/clearProfile" });
      }
      return Promise.reject(error);
    }
  );
};
