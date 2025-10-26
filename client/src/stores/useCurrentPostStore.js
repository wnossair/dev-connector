import { create } from "zustand";

export const useCurrentPostStore = create(set => ({
  // State
  current: null,
  loading: false,
  error: null,

  // Actions
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),

  setCurrentPost: post => set({ current: post }),
  clearCurrentPost: () => set({ current: null }),
  updateCurrentPost: updates =>
    set(state => ({
      current: state.current ? { ...state.current, ...updates } : null,
    })),
}));
