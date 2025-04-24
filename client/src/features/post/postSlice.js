import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setAppError } from "../error/errorSlice";

const initialState = {
  current: null,
  posts: [],
  loading: false,
};

export const loadAllPosts = createAsyncThunk(
  "post/all",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/posts");
      return response.data; // Return array directly
    } catch (error) {
      const errorData = error.response?.data || { message: "Failed to load posts" };
      dispatch(setAppError(errorData));
      return rejectWithValue(errorData);
    }
  }
);

export const loadCurrentPost = createAsyncThunk("post/current", async () => {});

export const addPost = createAsyncThunk(
  "post/add",
  async (postData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/posts", postData);
      return response.data; // Return post object directly
    } catch (error) {
      const errorData = error.response?.data || { message: "Failed to add post" };
      dispatch(setAppError(errorData));
      return rejectWithValue(errorData);
    }
  }
);
export const deletePost = createAsyncThunk("post/delete", async () => {});

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: builder => {
    // 1. First add all specific cases
    builder
      .addCase(loadAllPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.current = action.payload;
        state.posts = [action.payload, ...state.posts];
      });

    // 2. Then add matchers
    builder
      .addMatcher(
        action => action.type.startsWith("post/") && action.type.endsWith("/pending"),
        state => {
          state.loading = true;
        }
      )
      .addMatcher(
        action => action.type.startsWith("post/") && action.type.endsWith("/fulfilled"),
        state => {
          state.loading = false;
        }
      )
      .addMatcher(
        action => action.type.startsWith("post/") && action.type.endsWith("/rejected"),
        state => {
          state.loading = false;
        }
      );
  },
});

export default postSlice.reducer;
