import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const token = localStorage.getItem("token");

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return !isAuthenticated && !token ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedRoute;
