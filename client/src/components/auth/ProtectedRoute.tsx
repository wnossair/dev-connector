import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import { Spinner } from "../common/Feedback";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAppSelector(state => state.auth);
  const token = localStorage.getItem("token");

  if (loading) {
    return <Spinner />;
  }

  return !isAuthenticated && !token ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedRoute;
