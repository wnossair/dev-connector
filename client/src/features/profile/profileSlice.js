import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setAppError } from "../error/errorSlice";

const initialState = {
  current: null,
  loading: false,
};

const transformErrors = errors => {
  return errors.reduce((acc, { path, msg }) => {
    acc[path] = msg;
    return acc;
  }, {});
};

export const loadProfile = createAsyncThunk(
  "profile/current",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/profile");
      return { current: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { current: {} }; // Return empty profile for 404
      }

      const errorData = error.response?.data || { message: "Failed to load profile" };
      dispatch(setAppError(errorData));
      return rejectWithValue(errorData);
    }
  }
);

export const createProfile = createAsyncThunk(
  "profile/create",
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/profile", profileData);
      return { current: response.data };
    } catch (error) {
      const errorData = transformErrors(error.response?.data?.errors) || {
        message: "Failed to load profile",
      };

      dispatch(setAppError(errorData));
      return rejectWithValue(errorData);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "profile/delete",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.delete("/profile");
      return true;
    } catch (error) {
      const errorData = error.response?.data || { message: "Failed to delete profile" };
      dispatch(setAppError(errorData));
      return rejectWithValue(errorData);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: state => {
      state.current = null;
    },
  },
  extraReducers: builder => {
    // 1. First add all specific cases
    builder
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.current = action.payload.current;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.current = action.payload.current;
      })
      .addCase(deleteAccount.fulfilled, state => {
        state.current = null;
      });

    // 2. Then add matchers
    builder
      .addMatcher(
        action => action.type.startsWith("profile/") && action.type.endsWith("/pending"),
        state => {
          state.loading = true;
        }
      )
      .addMatcher(
        action => action.type.startsWith("profile/") && action.type.endsWith("/fulfilled"),
        state => {
          state.loading = false;
        }
      )
      .addMatcher(
        action => action.type.startsWith("profile/") && action.type.endsWith("/rejected"),
        state => {
          state.loading = false;
        }
      );
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
