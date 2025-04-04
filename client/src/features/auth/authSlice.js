import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setAppError } from "../error/errorSlice";

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

// Unified error handler
const handleError = (err, dispatch, defaultMessage) => {
  const error = {
    message: err.message || defaultMessage,
    status: err.status,
    data: err.response?.data || { message: defaultMessage },
    isBusiness: err?.isBusinessError || false,
  };

  dispatch(setAppError(error.data));
  return { error };
};

// Async Actions
export const registerUser = createAsyncThunk(
  "auth/register",
  async (newUser, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/users/register", newUser);
      return { user: res.data };
    } catch (err) {
      return rejectWithValue(handleError(err, dispatch, "Registration failed").error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (user, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/users/login", user);
      const token = res.data.token;
      api.defaults.headers.common["Authorization"] = token;
      await dispatch(loadUser()).unwrap();
      return { token };
    } catch (err) {
      return rejectWithValue(handleError(err, dispatch, "Login failed").error);
    }
  }
);

export const loadUser = createAsyncThunk("auth/load", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await api.get("/users/current");
    return { user: res.data };
  } catch (err) {
    return rejectWithValue(handleError(err, dispatch, "Failed to load user").error);
  }
});

export const verifyAuth = createAsyncThunk(
  "auth/verify",
  async ({ forceRefresh = false } = {}, { getState }) => {
    // 1. Fast path - token exists and we have user data (and not forcing refresh)
    if (!forceRefresh && getState().auth.user) {
      console.log(forceRefresh);
      return { isValid: true };
    }

    // 2. Check token existence
    if (!localStorage.getItem("token")) {
      return { isValid: false };
    }

    // 3. Actual verification
    try {
      await api.get("/users/current"); // Lightweight endpoint
      return { isValid: true };
    } catch {
      return { isValid: false };
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: clearAuthState,
  },
  extraReducers: builder => {
    // 1. First add all specific cases
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      });

    // 2. Then add matchers
    builder
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
        state => {
          state.loading = false;
        }
      );
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
