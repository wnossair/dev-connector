import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AddExperience from "./components/profile/AddExperience";
import AddEducation from "./components/profile/AddEducation";

import { useAuthStore } from "./stores/useAuthStore";
import { logger } from "./utils/logger";

import NotFound from "./components/common/NotFound";

import "./App.css";
import Profiles from "./components/developers/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/post/Posts";
import SinglePost from "./components/post/SinglePost";

const App = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const verifyAuth = useAuthStore(state => state.verifyAuth);

  // Periodic check for Authorization
  useEffect(() => {
    const delayInMinutes = 10;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const checkAuth = async () => {
      if (!isAuthenticated) return;

      try {
        // Forced to check with server if auth expired
        await verifyAuth({ forceRefresh: true });
      } catch (err) {
        logger.warn("Periodic auth verification failed", err);
      }
    };

    if (isAuthenticated) {
      intervalId = setInterval(checkAuth, delayInMinutes * 60 * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated, verifyAuth]);

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
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/profile/user/:id" element={<Profile />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/add-experience" element={<AddExperience />} />
              <Route path="/add-education" element={<AddEducation />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/post/:id" element={<SinglePost />} />
            </Route>
            {/* Catch-all for invalid paths (applied regardless of auth) */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
