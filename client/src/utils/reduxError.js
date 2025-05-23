// client/src/utils/reduxErrorUtils.js
import { setAppError } from "../features/error/errorSlice";

/**
 * Handles errors for async thunks, dispatches a global error,
 * and prepares a payload for rejectWithValue.
 * @param {Error} err - The error object, typically from an API call.
 * @param {function} dispatch - The dispatch function from the thunkAPI.
 * @param {string} defaultMessage - A default message if specific error messages aren't found.
 * @returns {object} Payload suitable for rejectWithValue.
 */
export const handleAsyncThunkError = (err, dispatch, defaultMessage) => {
  const apiResponse = err.response?.data; // Standardized server response
  const errorDetails = apiResponse?.error; // Actual error payload (string, object, or array)
  const errorMessage = apiResponse?.message || defaultMessage;

  // Prepare the error to be dispatched to the global error slice
  // This could be a structured object or a simple message string
  const errorToDispatch = errorDetails || { message: errorMessage };
  dispatch(setAppError(errorToDispatch));

  // Return a structured error payload for rejectWithValue
  // This allows components to access specific details if needed, especially for form errors
  return {
    status: err.response?.status,
    message: errorMessage, // Overall message from the server or default
    error: errorDetails, // Specific error details (e.g., field validation errors)
  };
};
