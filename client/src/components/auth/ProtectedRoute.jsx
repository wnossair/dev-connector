import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "../common/Feedback";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const token = localStorage.getItem("token");

  if (loading) {
    return (
      <Spinner />
    );
  }

  return !isAuthenticated && !token ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedRoute;
