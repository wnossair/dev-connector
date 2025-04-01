import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import * as apiUtils from "../../utils/api";

import { setAppError } from "../error/errorSlice";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: false,
  user: null,
};

// Clear state and storage
const clearStateAndStorage = state => {
  localStorage.removeItem("token");
  apiUtils.setAuthToken(null);

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
      const res = await axios.post("/api/users/register", newUser);
      return { user: res.data };
    } catch (err) {
      dispatch(setAppError(err.response.data));
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (user, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post("/api/users/login", user);
      apiUtils.setAuthToken(res.data.token);
      await dispatch(loadUser()).unwrap();

      return { token: res.data.token };
    } catch (err) {
      console.error(err);
      dispatch(setAppError(err.response.data));
      return rejectWithValue(err.response.data);
    }
  }
);

export const loadUser = createAsyncThunk("auth/load", async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get("/api/users/current");
    return { user: res.data };
  } catch (err) {
    if (err.response?.status === 401) {
      dispatch(logoutUser());
      return { user: null };
    }
    dispatch(setAppError(err.response.data));
    return rejectWithValue(err.response.data);
  }
});

export const verifyAuth = createAsyncThunk(
  "auth/verify",
  async (force = false, { dispatch, getState }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logoutUser());
      return { isValid: false };
    }

    apiUtils.setAuthToken(token);

    if (force || !getState().auth.user)
      await dispatch(loadUser())
        .unwrap()
        .catch(() => {
          return { isValid: false };
        });

    return { isValid: true };
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  // Sync Actions
  reducers: {
    logoutUser: state => clearStateAndStorage(state),
  },
  // Async Actions Setup
  extraReducers: builder => {
    builder
      // Register
      .addCase(registerUser.pending, state => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, state => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, state => {
        state.loading = false;
      })
      // Login
      .addCase(loginUser.pending, state => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem("token", action.payload.token);
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, state => {
        clearStateAndStorage(state);
      })
      // Load
      .addCase(loadUser.pending, state => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.rejected, state => {
        clearStateAndStorage(state);
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
