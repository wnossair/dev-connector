import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setAppError } from "../error/errorSlice";
import { handleAsyncThunkError } from "../../utils/reduxError";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: false,
  user: null,
};

const clearAuthState = state => {
  localStorage.removeItem("token");
  state.token = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.user = null;
};

// Async Actions
export const registerUser = createAsyncThunk(
  "auth/register",
  async (newUser, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/users/register", newUser);
      // res.data is { success: true, message: "...", data: { user }, error: null }
      // The thunk's fulfilled action will carry what's returned here.
      return res.data.data; // Contains { user }
    } catch (err) {
      return rejectWithValue(handleAsyncThunkError(err, dispatch, "Registration failed"));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/users/login", loginData);
      // res.data is { success: true, message: "...", data: { token }, error: null }
      const { token } = res.data.data;
      api.defaults.headers.common["Authorization"] = token;
      // loadUser will fetch user details and update the state.
      // The loginUser thunk focuses on getting the token.
      await dispatch(loadUser()).unwrap(); // Ensure user is loaded before login is considered fully complete
      return { token }; // Fulfilled action payload will be { token }
    } catch (err) {
      return rejectWithValue(handleAsyncThunkError(err, dispatch, "Login failed"));
    }
  }
);

export const loadUser = createAsyncThunk("auth/load", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await api.get("/users/current");
    // res.data is { success: true, message: "...", data: { user }, error: null }
    return res.data.data; // Contains { user }
  } catch (err) {
    // If loadUser fails (e.g. token expired), clear auth state.
    dispatch(logoutUser()); // Ensures UI reflects unauthenticated state
    return rejectWithValue(handleAsyncThunkError(err, dispatch, "Failed to load user session"));
  }
});

export const verifyAuth = createAsyncThunk(
  "auth/verify",
  async ({ forceRefresh = false } = {}, { getState, dispatch, rejectWithValue }) => {
    if (!forceRefresh && getState().auth.user && getState().auth.isAuthenticated) {
      return { isValid: true };
    }
    const token = localStorage.getItem("token");
    if (!token) {
      return { isValid: false };
    }
    api.defaults.headers.common["Authorization"] = token; // Ensure token is set for the verification call

    try {
      const res = await api.get("/users/current");
      if (res.data && res.data.success && res.data.data && res.data.data.user) {
        // If verification is successful and user data is stale or missing, dispatch loadUser
        if (!getState().auth.user || forceRefresh) {
          await dispatch(loadUser()).unwrap();
        }
        return { isValid: true };
      }
      // If response structure is unexpected or indicates failure without an error status
      dispatch(logoutUser());
      return { isValid: false };
    } catch (err) {
      // Typically a 401 error if token is invalid/expired
      dispatch(logoutUser()); // Clear out potentially invalid auth state
      // No need to dispatch setAppError here globally, as verifyAuth is a background check.
      // Individual components might handle the outcome of isAuthenticated.
      return rejectWithValue({
        isValid: false,
        error: handleAsyncThunkError(err, () => {}, "Auth verification failed"),
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: state => {
      // Changed to directly use clearAuthState
      clearAuthState(state);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        // User registration successful, but typically doesn't log in automatically.
        // User object might be in action.payload.user if needed for confirmation messages.
        state.loading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        // user state will be set by loadUser.fulfilled
        state.loading = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true; // Explicitly set here as well
        state.loading = false;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        if (!action.payload.isValid) {
          // If verification explicitly returns false, ensure auth state is cleared
          // This handles cases where token exists but is invalid, and loadUser might not have been called or failed silently
          if (state.isAuthenticated) {
            // only clear if it was previously authenticated
            clearAuthState(state);
          }
        }
        // If valid, user state should have been updated by loadUser within verifyAuth or was already fresh
        state.loading = false;
      })
      .addCase(verifyAuth.rejected, (state, action) => {
        // If verifyAuth is rejected (e.g., network error or explicit rejectWithValue with isValid: false)
        if (action.payload?.isValid === false || !action.payload?.isValid) {
          // Check if payload itself indicates invalid
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
      // Generic fulfilled and rejected for auth/ actions to stop loading
      // Specific fulfilled cases above will handle actual state changes
      .addMatcher(
        action => action.type.startsWith("auth/") && action.type.endsWith("/fulfilled"),
        state => {
          state.loading = false;
        }
      )
      .addMatcher(
        action => action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state, action) => {
          // Generic handler for rejected auth actions, mainly to stop loading.
          // Specific logout on critical failures (like 401) should be handled in thunks or verifyAuth.
          // For instance, if loadUser is rejected due to 401, logoutUser is already dispatched.
          state.loading = false;
          // If a login attempt specifically fails, ensure isAuthenticated is false.
          if (action.type === "auth/login/rejected") {
            clearAuthState(state);
          }
        }
      );
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
