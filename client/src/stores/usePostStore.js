import { create } from "zustand";

export const usePostsStore = create(set => ({
  // State
  posts: [],
  loading: false,
  error: null,

  // Actions
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),

  setPosts: posts => set({ posts }),

  addPost: post =>
    set(state => ({
      posts: [post, ...state.posts],
    })),

  deletePost: postId =>
    set(state => ({
      posts: state.posts.filter(post => post._id !== postId),
    })),

  updatePost: (postId, updates) =>
    set(state => ({
      posts: state.posts.map(post => (post._id === postId ? { ...post, ...updates } : post)),
    })),
}));
