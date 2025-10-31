import { configureStore, Middleware, UnknownAction } from "@reduxjs/toolkit";

import authReducer from "./features/auth/authSlice";
import errorReducer from "./features/error/errorSlice";
import profileReducer from "./features/profile/profileSlice";

import { injectStore } from "./utils/api";

const localStorageMiddleware: Middleware = store => next => (action: unknown) => {
  // 1. Let the action update Redux first
  const result = next(action);

  // 2. Only act on auth-related actions
  const typedAction = action as UnknownAction;
  if (typedAction.type && typedAction.type.startsWith("auth/")) {
    const state = store.getState() as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const { token } = state.auth;

    // 3. Sync to localStorage
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }

  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
    profile: profileReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(localStorageMiddleware),
});

// Infer the RootState type from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Inject store into API
injectStore(store);

export default store;
