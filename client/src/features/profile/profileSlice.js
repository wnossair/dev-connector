import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setAppError } from "../error/errorSlice";
import { logoutUser } from "../auth/authSlice";
import { handleAsyncThunkError } from "../../utils/reduxError";

const initialState = {
  current: null, // Unified member for both current and display profile
  loading: false,
  all: [],
  repos: [],
};

// Async Thunks
export const loadProfileById = createAsyncThunk(
  "profile/userId",
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get(`/profile/user/${userId}`);
      return response.data.data.profile;
    } catch (error) {
      if (error.response?.status === 404) {
        const errorPayload = handleAsyncThunkError(
          error,
          dispatch,
          `Profile for user ${userId} not found`
        );
        dispatch(setAppError(errorPayload.error || { message: errorPayload.message }));
        return null;
      }
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, `Failed to load profile for user ${userId}`)
      );
    }
  }
);

export const loadCurrentProfile = createAsyncThunk(
  "profile/current",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/profile/me");
      return response.data.data.profile;
    } catch (error) {
      if (error.response?.status === 404) {
        const errorPayload = handleAsyncThunkError(
          error,
          dispatch,
          "No profile found. Please create one."
        );
        dispatch(setAppError(errorPayload.error || { message: errorPayload.message }));
        return {};
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
      return { profiles: response.data.data.profiles };
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
      return response.data.data.profile;
    } catch (error) {
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
      return response.data.data.profile;
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
      return response.data.data.profile;
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
      return response.data.data.profile;
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
      return response.data.data.profile;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to delete education"));
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "profile/delete",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.delete("/profile");
      dispatch(logoutUser());
      return true;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to delete account"));
    }
  }
);

export const loadGithubRepos = createAsyncThunk(
  "profile/github",
  async (username, { dispatch, rejectWithValue }) => {
    try {
      console.log(username)
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
      state.all = [];
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadProfileById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(loadAllProfiles.fulfilled, (state, action) => {
        state.all = action.payload.profiles;
      })
      .addCase(loadCurrentProfile.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(loadGithubRepos.fulfilled, (state, action) => {
        state.repos = action.payload;
      })
      .addCase(loadGithubRepos.rejected || loadGithubRepos.rejectWithValue, (state) => {
        state.repos = [];
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(deleteAccount.fulfilled, state => {
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