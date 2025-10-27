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
      setLoading: loading => set({ loading }, false, "postList/setLoading"),
      setError: error => set({ error }, false, "postList/setError"),
      clearError: () => set({ error: null }, false, "postList/clearError"),
      setPosts: posts => set({ posts }, false, "postList/setPosts"),
      addPost: post => set(state => ({ posts: [post, ...state.posts] }), false, "postList/addPost"),
      deletePost: postId =>
        set(
          state => ({ posts: state.posts.filter(post => post._id !== postId) }),
          false,
          "postList/deletePost"
        ),
      updatePost: (postId, updates) =>
        set(
          state => ({
            posts: state.posts.map(post => (post._id === postId ? { ...post, ...updates } : post)),
          }),
          false,
          "postList/updatePost"
        ),
    }),
    {
      name: "Post List",
      // This connects to the main Redux DevTools instance
      store: "postList",
    }
  )
);
