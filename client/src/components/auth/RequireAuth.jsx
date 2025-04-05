// This is the legacy way that I used to protect routes
// It is superceeded by ProtectedRoute as it is an easier and better way

// Usage (in App.jsx)
{
  /* <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} /> */
}

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // Go to
  useEffect(() => {
    if (!isAuthenticated && !token) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

export default RequireAuth;
