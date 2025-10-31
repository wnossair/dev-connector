import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import store from "./store";
import { loadUser, verifyAuth } from "./features/auth/authSlice";
import { loadCurrentProfile } from "./features/profile/profileSlice";

// Async function to check auth and load data
async function initializeApp() {
  try {
    const { isValid } = await store.dispatch(verifyAuth()).unwrap();

    if (isValid) {
      // Dispatch both in parallel, wait for all
      await Promise.all([
        store.dispatch(loadUser()).unwrap(),
        store.dispatch(loadCurrentProfile()).unwrap(),
      ]);
    }
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

// Initialize auth before rendering the app
initializeApp().then(() => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
});
