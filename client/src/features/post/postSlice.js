import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setAppError } from "../error/errorSlice";
import { handleAsyncThunkError } from "../../utils/reduxError";

const initialState = {
  current: null, // For a single post view
  posts: [], // For feed
  loading: false,
};

// Async Thunks
export const loadAllPosts = createAsyncThunk(
  "post/all",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/posts");
      // response.data is { success: true, message: "...", data: { posts: [...] }, error: null }
      return response.data.data.posts;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to load posts"));
    }
  }
);

export const loadCurrentPost = createAsyncThunk(
  "post/current",
  async (postId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data.data.post;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to load post"));
    }
  }
);

export const addPost = createAsyncThunk(
  "post/add",
  async (postData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/posts", postData);
      return response.data.data.post;
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to add post"));
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/delete",
  async (postId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}`);
      // Server returns { success: true, message: "Post removed successfully", data: null, error: null }
      return postId; // Return postId to identify which post to remove from state
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to delete post"));
    }
  }
);

export const likePost = createAsyncThunk(
  "post/like",
  async (postId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/like/${postId}`);
      // server response.data.data is { likes: [...] }
      // For easier state update, let's assume the server could also return the updated post object
      // If only likes array is returned by server:
      // return { postId, likes: response.data.data.likes };
      // For this example, assuming server sends back the whole updated post in response.data.data.post
      // If not, the reducer needs to be smarter or the API should return the full post.
      // Let's stick to the current API that returns `likes` array.
      // We need the post ID to update the correct post in the `posts` array and `current` post.
      return { postId, likes: response.data.data.likes };
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to like post"));
    }
  }
);

export const unlikePost = createAsyncThunk(
  "post/unlike",
  async (postId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/unlike/${postId}`);
      return { postId, likes: response.data.data.likes };
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to unlike post"));
    }
  }
);

export const addComment = createAsyncThunk(
  "post/comment/add",
  async ({ postId, commentData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/comment/${postId}`, commentData);
      // server response.data.data is { comments: [...] }
      return { postId, comments: response.data.data.comments };
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to add comment"));
    }
  }
);

export const deleteComment = createAsyncThunk(
  "post/comment/delete",
  async ({ postId, commentId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/posts/comment/${postId}/${commentId}`);
      return { postId, comments: response.data.data.comments };
    } catch (error) {
      return rejectWithValue(handleAsyncThunkError(error, dispatch, "Failed to delete comment"));
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearCurrentPost: state => {
      state.current = null;
    },
    clearPosts: state => {
      state.posts = [];
      state.current = null;
    },
  },
  extraReducers: builder => {
    const updatePostInState = (state, postId, newProps) => {
      const postIndex = state.posts.findIndex(p => p._id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...newProps };
      }
      if (state.current && state.current._id === postId) {
        state.current = { ...state.current, ...newProps };
      }
    };

    builder
      .addCase(loadAllPosts.fulfilled, (state, action) => {
        state.posts = action.payload; // payload is the posts array
      })
      .addCase(loadCurrentPost.fulfilled, (state, action) => {
        state.current = action.payload; // payload is the single post object
      })
      .addCase(addPost.fulfilled, (state, action) => {
        // state.current = action.payload; // Optionally set current to the new post
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload); // action.payload is postId
        if (state.current && state.current._id === action.payload) {
          state.current = null;
        }
      })
      .addCase(likePost.fulfilled, (state, action) => {
        updatePostInState(state, action.payload.postId, { likes: action.payload.likes });
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        updatePostInState(state, action.payload.postId, { likes: action.payload.likes });
      })
      .addCase(addComment.fulfilled, (state, action) => {
        updatePostInState(state, action.payload.postId, { comments: action.payload.comments });
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        updatePostInState(state, action.payload.postId, { comments: action.payload.comments });
      });

    builder
      .addMatcher(
        action => action.type.startsWith("post/") && action.type.endsWith("/pending"),
        state => {
          state.loading = true;
        }
      )
      .addMatcher(
        action =>
          action.type.startsWith("post/") &&
          (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected")),
        state => {
          state.loading = false;
        }
      );
  },
});

export const { clearCurrentPost, clearPosts } = postSlice.actions;
export default postSlice.reducer;
