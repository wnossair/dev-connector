import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { setAppError } from "../error/errorSlice";

// Async Actions
export const register = createAsyncThunk(
  "auth/register",
  async (newUser, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post("/api/users/register", newUser);
      console.log(res);
      return { user: res.data };
    } catch (err) {
      dispatch(setAppError(err.response.data));
      return rejectWithValue(err.response.data);
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isAuthenticated: false,
    loading: false,
    user: null,
  },
  // Sync Actions
  reducers: {
    logout: state => {
      localStorage.removeItem("token");
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
  },
  // Async Actions Setup
  extraReducers: builder => {
    builder
      // Register
      .addCase(register.pending, state => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        localStorage.setItem("token", action.payload.token);
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, state => {
        localStorage.removeItem("token");
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
