import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  // Go to 
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

export default RequireAuth;
