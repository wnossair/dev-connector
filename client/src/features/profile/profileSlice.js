import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setAppError } from "../error/errorSlice";

const initialState = {
  profile: null,
  loading: false,
};

export const loadCurrentProfile = createAsyncThunk(
  "profile/current",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/profile");
      return { profile: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { profile: {} }; // Return empty profile for 404
      }

      const errorData = error.response?.data || { message: "Failed to load profile" };
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
      state.profile = null;
    },
  },
  extraReducers: builder => {
    // 1. First add all specific cases
    builder.addCase(loadCurrentProfile.fulfilled, (state, action) => {
      state.profile = action.payload.profile;
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
