import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setAppError } from "../error/errorSlice";

const initialState = {
  current: null,
  display: null,
  loading: false,
  all: [],
};

const transformErrors = errors => {
  return errors.reduce((acc, { path, msg }) => {
    acc[path] = msg;
    return acc;
  }, {});
};

export const loadProfileByHandle = createAsyncThunk(
  "profile/handle",
  async (handle, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get(`/profile/handle/${handle}`);
      return { display: response.data };
    } catch (error) {
      if (error.response?.status === 404) {
        return { display: null }; // Return empty profile for 404
      }

      const errorData = error.response?.data || { message: `Failed to load profile for ${handle}` };
      dispatch(setAppError(errorData));
      return rejectWithValue(errorData);
    }
  }
);

export const loadCurrentProfile = createAsyncThunk(
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

export const loadAllProfiles = createAsyncThunk(
  "profile/all",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/profile/all");
      return { current: response.data };
    } catch (error) {
      const errorData = error.response?.data || { message: "Failed to load all profiles" };
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

export const addExperience = createAsyncThunk(
  "profile/experience/add",
  async (experienceData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/profile/experience", experienceData);
      return { current: response.data };
    } catch (error) {
      console.log(error);
      const errorData = error.response?.data || { message: "Failed to add experience" };

      dispatch(setAppError(errorData));
      return rejectWithValue(errorData);
    }
  }
);

export const addEducation = createAsyncThunk(
  "profile/education/add",
  async (educationData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/profile/education", educationData);
      return { current: response.data };
    } catch (error) {
      console.log(error);
      const errorData = error.response?.data || { message: "Failed to add education" };

      dispatch(setAppError(errorData));
      return rejectWithValue(errorData);
    }
  }
);

export const deleteExperience = createAsyncThunk(
  "profile/experience/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/profile/experience/${id}`);
      return { current: response.data };
    } catch (error) {
      const errorData = error.response?.data || { message: "Failed to delete experience" };
      dispatch(setAppError(errorData));
      return rejectWithValue(errorData);
    }
  }
);

export const deleteEducation = createAsyncThunk(
  "profile/education/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/profile/education/${id}`);
      return { current: response.data };
    } catch (error) {
      const errorData = error.response?.data || { message: "Failed to delete education" };
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
      .addCase(loadProfileByHandle.fulfilled, (state, action) => {
        state.display = action.payload.display;
      })
      .addCase(loadAllProfiles.fulfilled, (state, action) => {
        state.all = action.payload.current;
      })
      .addCase(loadCurrentProfile.fulfilled, (state, action) => {
        state.current = action.payload.current;
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
