import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { handleAsyncThunkError } from "../../utils/reduxError";
import {
  AuthState,
  RegisterData,
  LoginCredentials,
  VerifyAuthOptions,
  AuthResponse,
  UserResponse,
  ApiResponse,
} from "../../types";
import { ThunkConfig } from "../../types/store.types";

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: false,
  user: null,
};

const clearAuthState = (state: AuthState): void => {
  localStorage.removeItem("token");
  state.token = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.user = null;
};

// Async Actions
export const registerUser = createAsyncThunk<UserResponse, RegisterData, ThunkConfig>(
  "auth/register",
  async (newUser, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<UserResponse>>("/users/register", newUser);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(handleAsyncThunkError(err, dispatch, "Registration failed").message);
    }
  }
);

export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials, ThunkConfig>(
  "auth/login",
  async (loginData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<AuthResponse>>("/users/login", loginData);
      const { token } = res.data.data;
      if (api.defaults.headers.common) {
        api.defaults.headers.common["Authorization"] = token;
      }
      await dispatch(loadUser()).unwrap();
      return { token };
    } catch (err) {
      return rejectWithValue(handleAsyncThunkError(err, dispatch, "Login failed").message);
    }
  }
);

export const loadUser = createAsyncThunk<UserResponse, void, ThunkConfig>(
  "auth/load",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<UserResponse>>("/users/current");
      return res.data.data;
    } catch (err) {
      dispatch(logoutUser());
      return rejectWithValue(
        handleAsyncThunkError(err, dispatch, "Failed to load user session").message
      );
    }
  }
);

interface VerifyAuthResult {
  isValid: boolean;
  error?: string;
}

export const verifyAuth = createAsyncThunk<
  VerifyAuthResult,
  VerifyAuthOptions | void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { state: any; dispatch: any; rejectValue: VerifyAuthResult }
>("auth/verify", async (options, { getState, dispatch, rejectWithValue }) => {
  const { forceRefresh = false } = options || {};
  const state = getState();

  if (!forceRefresh && state.auth.user && state.auth.isAuthenticated) {
    return { isValid: true };
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return { isValid: false };
  }

  if (api.defaults.headers.common) {
    api.defaults.headers.common["Authorization"] = token;
  }

  try {
    const res = await api.get<ApiResponse<UserResponse>>("/users/current");
    if (res.data && res.data.success && res.data.data && res.data.data.user) {
      const currentState = getState();
      if (!currentState.auth.user || forceRefresh) {
        await dispatch(loadUser()).unwrap();
      }
      return { isValid: true };
    }
    dispatch(logoutUser());
    return { isValid: false };
  } catch (err) {
    dispatch(logoutUser());
    const errorResult = handleAsyncThunkError(err, () => {}, "Auth verification failed");
    return rejectWithValue({
      isValid: false,
      error: errorResult.message,
    });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: state => {
      clearAuthState(state);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.fulfilled, state => {
        state.loading = false;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(verifyAuth.fulfilled, (state, action: PayloadAction<VerifyAuthResult>) => {
        if (!action.payload.isValid) {
          if (state.isAuthenticated) {
            clearAuthState(state);
          }
        }
        state.loading = false;
      })
      .addCase(verifyAuth.rejected, (state, action) => {
        const payload = action.payload as VerifyAuthResult | undefined;
        if (payload?.isValid === false || !payload?.isValid) {
          if (state.isAuthenticated) {
            clearAuthState(state);
          }
        }
        state.loading = false;
      })
      .addMatcher(
        action => action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        state => {
          state.loading = true;
        }
      )
      .addMatcher(
        action => action.type.startsWith("auth/") && action.type.endsWith("/fulfilled"),
        state => {
          state.loading = false;
        }
      )
      .addMatcher(
        action => action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          if (action.type === "auth/login/rejected") {
            clearAuthState(state);
          }
        }
      );
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
