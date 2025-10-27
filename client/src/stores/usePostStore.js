import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const usePostStore = create(
  devtools(
    set => ({
      // State
      post: null,
      loading: false,
      error: null,

      // Actions
      setLoading: loading => set({ loading }, false, "post/setLoading"),
      setError: error => set({ error }, false, "post/setError"),
      clearError: () => set({ error: null }, false, "post/clearError"),
      setPost: post => set({ post }, false, "post/setPost"),
      clearPost: () => set({ post: null }, false, "post/clearPost"),
      updatePost: updates =>
        set(
          state => ({
            post: state.post ? { ...state.post, ...updates } : null,
          }),
          false,
          "post/updatePost"
        ),
    }),
    {
      name: "Post",
      store: "post",
    }
  )
);
