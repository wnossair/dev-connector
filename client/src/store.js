import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import errorReducer from "./features/error/errorSlice";

const localStorageMiddleware =
  ({ getState }) =>
  next =>
  action => {
    // 1. Let the action update Redux first
    const result = next(action);

    // 2. Only act on auth-related actions
    if (action.type.startsWith("auth/")) {
      const { token } = getState().auth;

      // 3. Sync to localStorage
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    }

    return result;
  };

const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
