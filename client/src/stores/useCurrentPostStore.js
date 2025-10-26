import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useCurrentPostStore = create(
  devtools(
    set => ({
      // State
      current: null,
      loading: false,
      error: null,

      // Actions
      setLoading: loading => set({ loading }, false, "setLoading"),
      setError: error => set({ error }, false, "setError"),
      clearError: () => set({ error: null }, false, "clearError"),

      setCurrentPost: post => set({ current: post }, false, "setCurrentPost"),
      clearCurrentPost: () => set({ current: null }, false, "clearCurrentPost"),
      updateCurrentPost: updates =>
        set(
          state => ({
            current: state.current ? { ...state.current, ...updates } : null,
          }),
          false,
          "updateCurrentPost"
        ),
    }),
    {
      name: "Current Post Store",
      store: "useCurrentPostStore",
    }
  )
);
