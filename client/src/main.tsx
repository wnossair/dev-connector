import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { useAuthStore } from "./stores/useAuthStore";
import { useProfileStore } from "./stores/useProfileStore";
import { setupApiInterceptors } from "./utils/api";
import { logger } from "./utils/logger";

// Setup API interceptors for 401 error handling
setupApiInterceptors();

// Async function to check auth and load data
async function initializeApp() {
  try {
    const authStore = useAuthStore.getState();
    const profileStore = useProfileStore.getState();

    const { isValid } = await authStore.verifyAuth();

    if (isValid) {
      // Load both in parallel
      await Promise.all([authStore.loadUser(), profileStore.loadCurrentProfile()]);
    }
  } catch (error) {
    logger.error("App initialization failed", error);
  }
}

// Initialize auth before rendering the app
initializeApp().then(() => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
