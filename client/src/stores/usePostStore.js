import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const usePostStore = create(
  devtools(
    set => ({
      // State
      post: null, // Changed from 'current' to 'post' for consistency
      loading: false,
      error: null,

      // Actions
      setLoading: loading => set({ loading }, false, "setLoading"),
      setError: error => set({ error }, false, "setError"),
      clearError: () => set({ error: null }, false, "clearError"),

      setPost: post => set({ post }, false, "setPost"), // Changed from setCurrentPost
      clearPost: () => set({ post: null }, false, "clearPost"), // Changed from clearCurrentPost
      updatePost: updates =>
        set(
          state => ({
            // Changed from updateCurrentPost
            post: state.post ? { ...state.post, ...updates } : null,
          }),
          false,
          "updatePost"
        ),
    }),
    {
      name: "Post Store",
      store: "post",
    }
  )
);
