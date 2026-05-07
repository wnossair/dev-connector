import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { Spinner } from "../common/Feedback";
import Unauthorized from "../common/Unauthorized";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const loading = useAuthStore(state => state.loading);
  const token = localStorage.getItem("token");

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated && !token) {
    return <Unauthorized />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
