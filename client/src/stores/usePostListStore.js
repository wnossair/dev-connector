import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const usePostListStore = create(
  devtools(
    set => ({
      // State
      posts: [],
      loading: false,
      error: null,

      // Actions
      setLoading: loading => set({ loading }, false, "setLoading"),
      setError: error => set({ error }, false, "setError"),
      clearError: () => set({ error: null }, false, "clearError"),

      setPosts: posts => set({ posts }, false, "setPosts"),
      addPost: post =>
        set(
          state => ({
            posts: [post, ...state.posts],
          }),
          false,
          "addPost"
        ),
      deletePost: postId =>
        set(
          state => ({
            posts: state.posts.filter(post => post._id !== postId),
          }),
          false,
          "deletePost"
        ),
      updatePost: (postId, updates) =>
        set(
          state => ({
            posts: state.posts.map(post => (post._id === postId ? { ...post, ...updates } : post)),
          }),
          false,
          "updatePost"
        ),
    }),
    {
      name: "Post List Store",
      store: "posts",
    }
  )
);
