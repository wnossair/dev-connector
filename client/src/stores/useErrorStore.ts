import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AppError } from "../types";

interface ErrorStore {
  error: AppError | null;
  setError: (error: AppError | null) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorStore>()(
  devtools(
    set => ({
      // State
      error: null,

      // Actions
      setError: error => set({ error }, false, "error/setError"),
      clearError: () => set({ error: null }, false, "error/clearError"),
    }),
    {
      name: "Error",
      store: "error",
    }
  )
);
