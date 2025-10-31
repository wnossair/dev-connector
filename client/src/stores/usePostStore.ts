import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Post } from "../types";

interface PostStore {
  post: Post | null;
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setPost: (post: Post) => void;
  clearPost: () => void;
  updatePost: (updates: Partial<Post>) => void;
}

export const usePostStore = create<PostStore>()(
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
