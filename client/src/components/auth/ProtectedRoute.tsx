import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { Spinner } from "../common/Feedback";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const loading = useAuthStore(state => state.loading);
  const token = localStorage.getItem("token");

  if (loading) {
    return <Spinner />;
  }

  return !isAuthenticated && !token ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedRoute;
