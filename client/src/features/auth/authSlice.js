import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  isAuthenticated: false,
  user: {},
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    // This is only here to follow the course. Remove after adding first reducer
    default: state => {
      return state;
    },
  },
});

export default authSlice.reducer;
