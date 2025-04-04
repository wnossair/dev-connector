import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Provider } from "react-redux";

import store from "./store";
import { loadUser, verifyAuth } from "./features/auth/authSlice";
import { loadProfile } from "./features/profile/profileSlice.js";

if (store.dispatch(verifyAuth())) {
  store.dispatch(loadUser());
  store.dispatch(loadProfile())
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
