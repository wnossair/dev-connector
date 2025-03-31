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
      console.log(err);
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
    dispatch(setAppError(err.response.data));
    return rejectWithValue(err.response.data);
  }
});

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("token");
    if (token) {
      apiUtils.setAuthToken(token);
      await dispatch(loadUser()).unwrap();
    }
    return { token };
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  // Sync Actions
  reducers: {
    logoutUser: state => {
      clearStateAndStorage(state);
    },
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
