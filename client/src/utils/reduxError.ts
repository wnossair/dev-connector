import { AxiosError } from "axios";
import { setAppError } from "../features/error/errorSlice";
import { ApiError, ErrorResponse, ValidationError } from "../types";
import { AppDispatch } from "../types/store.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DispatchFunction = AppDispatch | ((action: any) => void);

/**
 * Handles errors for async thunks, dispatches a global error,
 * and prepares a payload for rejectWithValue.
 * @param err - The error object, typically from an API call
 * @param dispatch - The dispatch function from the thunkAPI
 * @param defaultMessage - A default message if specific error messages aren't found
 * @returns Payload suitable for rejectWithValue
 */
export const handleAsyncThunkError = (
  err: unknown,
  dispatch: DispatchFunction,
  defaultMessage: string
): {
  status?: number;
  message: string;
  error: string | ValidationError | null;
} => {
  const error = err as ApiError | AxiosError<ErrorResponse>;
  const apiResponse = error.response?.data as ErrorResponse | undefined;
  const errorDetails = apiResponse?.error || null;
  const errorMessage = apiResponse?.message || defaultMessage;

  // Prepare the error to be dispatched to the global error slice
  const errorToDispatch = errorDetails || { message: errorMessage };
  dispatch(setAppError(errorToDispatch));

  // Return a structured error payload for rejectWithValue
  return {
    status: error.response?.status,
    message: errorMessage,
    error: errorDetails,
  };
};
