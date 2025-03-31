import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Provider } from "react-redux";

import store from "./store";
import { initializeAuth } from "./features/auth/authSlice";

store.dispatch(initializeAuth()); // Initialize once on app load

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
