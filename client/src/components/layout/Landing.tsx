import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

const Landing = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing">
      <div className="landing-inner">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8">
              <h1 className="display-3 mb-4">Developer Connector</h1>
              <p className="lead mb-8">
                Create a developer profile/portfolio, share posts and get help from other developers
              </p>
              <hr />
              <div className="btn-group">
                <Link to="/register" className="btn btn-lg btn-light">
                  <i className="bi bi-star"></i>
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-lg btn-secondary">
                  <i className="bi bi-box-arrow-in-right"></i>
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
