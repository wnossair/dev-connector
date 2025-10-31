import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppError } from "../../types";

const errorSlice = createSlice({
  name: "error",
  initialState: null as AppError,
  reducers: {
    setAppError: (_state, action: PayloadAction<AppError>) => action.payload,
    clearAppError: () => null,
  },
});

export const { setAppError, clearAppError } = errorSlice.actions;
export default errorSlice.reducer;
