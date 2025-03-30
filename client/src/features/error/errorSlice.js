import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: null,
  reducers: {
    setAppError: (state, action) => action.payload, // Always keep state for Immer!
    clearAppError: () => null,
  },
});

export const { setAppError, clearAppError } = errorSlice.actions;
export default errorSlice.reducer;
