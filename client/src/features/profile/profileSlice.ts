import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { api } from "../../utils/api";
import { setAppError } from "../error/errorSlice";
import { logoutUser } from "../auth/authSlice";
import { handleAsyncThunkError } from "../../utils/reduxError";
import {
  Profile,
  CreateProfileData,
  AddExperienceData,
  AddEducationData,
  ApiResponse,
  ProfileResponse,
  ProfilesResponse,
} from "../../types";
import { ThunkConfig } from "../../types/store.types";

interface ProfileState {
  current: Profile | null;
  loading: boolean;
  all: Profile[];
  repos: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const initialState: ProfileState = {
  current: null,
  loading: false,
  all: [],
  repos: [],
};

// Async Thunks
export const loadProfileById = createAsyncThunk<Profile | null, string, ThunkConfig>(
  "profile/userId",
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ProfileResponse>>(`/profile/user/${userId}`);
      return response.data.data.profile;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        const errorPayload = handleAsyncThunkError(
          error,
          dispatch,
          `Profile for user ${userId} not found`
        );
        dispatch(setAppError(errorPayload.error || { message: errorPayload.message }));
        return null;
      }
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, `Failed to load profile for user ${userId}`).message
      );
    }
  }
);

export const loadCurrentProfile = createAsyncThunk<
  Profile | Record<string, never>,
  void,
  ThunkConfig
>("profile/current", async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<ProfileResponse>>("/profile/me");
    return response.data.data.profile;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      const errorPayload = handleAsyncThunkError(
        error,
        dispatch,
        "No profile found. Please create one."
      );
      dispatch(setAppError(errorPayload.error || { message: errorPayload.message }));
      return {};
    }
    return rejectWithValue(
      handleAsyncThunkError(error, dispatch, "Failed to load current profile").message
    );
  }
});

export const loadAllProfiles = createAsyncThunk<{ profiles: Profile[] }, void, ThunkConfig>(
  "profile/all",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ProfilesResponse>>("/profile/all");
      return { profiles: response.data.data.profiles };
    } catch (error) {
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, "Failed to load all profiles").message
      );
    }
  }
);

export const createProfile = createAsyncThunk<Profile, CreateProfileData, ThunkConfig>(
  "profile/create",
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ProfileResponse>>("/profile", profileData);
      return response.data.data.profile;
    } catch (error) {
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, "Failed to create/update profile").message
      );
    }
  }
);

export const addExperience = createAsyncThunk<Profile, AddExperienceData, ThunkConfig>(
  "profile/experience/add",
  async (experienceData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ProfileResponse>>(
        "/profile/experience",
        experienceData
      );
      return response.data.data.profile;
    } catch (error) {
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, "Failed to add experience").message
      );
    }
  }
);

export const addEducation = createAsyncThunk<Profile, AddEducationData, ThunkConfig>(
  "profile/education/add",
  async (educationData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ProfileResponse>>(
        "/profile/education",
        educationData
      );
      return response.data.data.profile;
    } catch (error) {
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, "Failed to add education").message
      );
    }
  }
);

export const deleteExperience = createAsyncThunk<Profile, string, ThunkConfig>(
  "profile/experience/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<ProfileResponse>>(`/profile/experience/${id}`);
      return response.data.data.profile;
    } catch (error) {
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, "Failed to delete experience").message
      );
    }
  }
);

export const deleteEducation = createAsyncThunk<Profile, string, ThunkConfig>(
  "profile/education/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<ProfileResponse>>(`/profile/education/${id}`);
      return response.data.data.profile;
    } catch (error) {
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, "Failed to delete education").message
      );
    }
  }
);

export const deleteAccount = createAsyncThunk<boolean, void, ThunkConfig>(
  "profile/delete",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.delete("/profile");
      dispatch(logoutUser());
      return true;
    } catch (error) {
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, "Failed to delete account").message
      );
    }
  }
);

export const loadGithubRepos = createAsyncThunk<any[], string, ThunkConfig>( // eslint-disable-line @typescript-eslint/no-explicit-any
  "profile/github",
  async (username, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<any[]>>(`/profile/github/${username}`); // eslint-disable-line @typescript-eslint/no-explicit-any
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        handleAsyncThunkError(error, dispatch, "Failed to load Github repos").message
      );
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
      .addCase(loadProfileById.fulfilled, (state, action: PayloadAction<Profile | null>) => {
        state.current = action.payload;
        state.repos = [];
      })
      .addCase(loadAllProfiles.fulfilled, (state, action) => {
        state.all = action.payload.profiles;
      })
      .addCase(loadCurrentProfile.fulfilled, (state, action) => {
        state.current = action.payload as Profile;
        state.repos = [];
      })
      .addCase(loadGithubRepos.fulfilled, (state, action) => {
        state.repos = action.payload;
      })
      .addCase(loadGithubRepos.rejected, state => {
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
