import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import ContainerLayout from "./components/layout/ContainerLayout";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import RequireAuth from "./components/auth/RequireAuth";

import Dashboard from "./components/dashboard/Dashboard";

import store from "./store";
import { verifyAuth } from "./features/auth/authSlice";

import "./App.css";

const App = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  // Periodic check for Authorization
  useEffect(() => {
    const delayInMinutes = 5;
    let intervalId;

    const checkAuth = () => {
      if (isAuthenticated) {
        store.dispatch(verifyAuth(true)).catch(err => console.error("auth/verify error:", err));
      }
    };

    if (isAuthenticated) {
      intervalId = setInterval(checkAuth, delayInMinutes * 60 * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  // Component
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<ContainerLayout />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />{" "}
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
