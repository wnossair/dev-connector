import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Post } from "../types";

interface PostListStore {
  posts: Post[];
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
}

export const usePostListStore = create<PostListStore>()(
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
      store: "postList",
    }
  )
);
