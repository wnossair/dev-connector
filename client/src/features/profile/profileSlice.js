import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setAppError } from "../error/errorSlice";
import { logoutUser } from "../auth/authSlice"; // Import for handling 401
import { handleAsyncThunkError } from "../../utils/reduxError";

const initialState = {
  current: null,
  display: null,
  loading: false,
  all: [],
  repos: [],
};

// Async Thunks
export const loadProfileByHandle = createAsyncThunk(
  "profile/handle",
  async (handle, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get(`/profile/handle/${handle}`);
      return { display: response.data.data.profile };
    } catch (error) {
      if (error.response?.status === 404) {
        const errorPayload = handleAsyncThunkError(
          error,
          dispatch,
          `Profile for ${handle} not found`
        );

        dispatch(setAppError(errorPayload.error || { message: errorPayload.message }));
        return { display: null };
      }

      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, `Failed to load profile for ${handle}`)
      );
    }
  }
);

export const loadCurrentProfile = createAsyncThunk(
  "profile/current",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/profile/me");
      return { current: response.data.data.profile }; // Correctly extracting
    } catch (error) {
      if (error.response?.status === 404) {
        const errorPayload = handleAsyncThunkError(
          error,
          dispatch,
          "No profile found. Please create one."
        );

        dispatch(setAppError(errorPayload.error || { message: errorPayload.message }));
        return { current: {} };
      }

      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, "Failed to load current profile")
      );
    }
  }
);

export const loadAllProfiles = createAsyncThunk(
  "profile/all",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/profile/all");
      return { profiles: response.data.data.profiles }; // Correctly extracting
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to load all profiles"));
    }
  }
);

export const createProfile = createAsyncThunk(
  "profile/create",
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/profile", profileData);
      return { current: response.data.data.profile }; // Correctly extracting
    } catch (error) {
      // Server validation errors are in error.response.data.error
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, "Failed to create/update profile")
      );
    }
  }
);

export const addExperience = createAsyncThunk(
  "profile/experience/add",
  async (experienceData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/profile/experience", experienceData);
      return { current: response.data.data.profile }; // Correctly extracting
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to add experience"));
    }
  }
);

export const addEducation = createAsyncThunk(
  "profile/education/add",
  async (educationData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/profile/education", educationData);
      return { current: response.data.data.profile }; // Correctly extracting
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to add education"));
    }
  }
);

export const deleteExperience = createAsyncThunk(
  "profile/experience/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/profile/experience/${id}`);
      return { current: response.data.data.profile }; // Correctly extracting
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to delete experience"));
    }
  }
);

export const deleteEducation = createAsyncThunk(
  "profile/education/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/profile/education/${id}`);
      return { current: response.data.data.profile }; // Correctly extracting
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to delete education"));
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "profile/delete",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Server response is { success: true, message: "...", data: null, error: null }
      await api.delete("/profile");
      dispatch(logoutUser()); // Also logout user after account deletion
      return true; // Indicates success for the reducer
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to delete account"));
    }
  }
);

export const loadGithubRepos = createAsyncThunk(
  "profile/github",
  async (username, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get(`/profile/github/${username}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to load Github repos"));
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: state => {
      state.current = null;
      state.display = null;
      state.all = []; // Also clear all profiles list
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadProfileByHandle.fulfilled, (state, action) => {
        state.display = action.payload.display; // display can be null if not found
      })
      .addCase(loadAllProfiles.fulfilled, (state, action) => {
        state.all = action.payload.profiles;
      })
      .addCase(loadCurrentProfile.fulfilled, (state, action) => {
        state.current = action.payload.current; // current can be {} if not found
      })
      .addCase(loadGithubRepos.fulfilled, (state, action) => {
        state.repos = action.payload;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.current = action.payload.current;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.current = action.payload.current;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.current = action.payload.current;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.current = action.payload.current;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.current = action.payload.current;
      })
      .addCase(deleteAccount.fulfilled, state => {
        // State clearing is now handled by clearProfile, which will be dispatched
        // by the component or by the logoutUser action triggered in the thunk.
        // For directness, we can also call it here.
        profileSlice.caseReducers.clearProfile(state);
      });

    builder
      .addMatcher(
        action => action.type.startsWith("profile/") && action.type.endsWith("/pending"),
        state => {
          state.loading = true;
        }
      )
      .addMatcher(
        action =>
          action.type.startsWith("profile/") &&
          (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected")),
        state => {
          state.loading = false;
        }
      );
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
