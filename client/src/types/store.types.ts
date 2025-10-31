/**
 * Redux Store Types
 */

import { AuthState } from "./auth.types";
import { ProfileState } from "./profile.types";
import { ErrorState } from "./error.types";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

// Root State type for the entire Redux store
export interface RootState {
  auth: AuthState;
  profile: ProfileState;
  error: ErrorState;
}

// App Dispatch type
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

// Type for async thunk config
export interface ThunkConfig {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}
