import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import ContainerLayout from "./components/layout/ContainerLayout";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";

import CreateProfile from "./components/profile/CreateProfile";
import EditProfile from "./components/profile/EditProfile";

import store from "./store";
import { verifyAuth } from "./features/auth/authSlice";

import "./App.css";
import AddExperience from "./components/profile/AddExperience";
import AddEducation from "./components/profile/AddEducation";

const App = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  // Periodic check for Authorization
  useEffect(() => {
    const delayInMinutes = 10;
    let intervalId;

    const checkAuth = async () => {
      if (!isAuthenticated) return;

      try {
        // Forced to check with server if auth expired
        await store.dispatch(verifyAuth({ forceRefresh: true }));
      } catch (err) {
        console.error("auth/verify error:", err);
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
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/add-experience" element={<AddExperience />} />
              <Route path="/add-education" element={<AddEducation />} />
              {/* Add more protected routes here */}

              {/* Catch-all Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
