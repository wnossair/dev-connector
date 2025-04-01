import React from "react";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [logoutLoading, setLogoutLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      // await new Promise(resolve => setTimeout(resolve, 5000));
      dispatch(logoutUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          DevConnector
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/profiles">
                Developers
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <li className="nav-item pe-3">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item pe-3">
                  <Link className="nav-link" to={`/profile/${user?.profile?.handle || user?._id}`}>
                    Profile
                  </Link>
                </li>
                <li className="nav-item d-flex align-items-center">
                  <button className="nav-link" onClick={handleLogout} disabled={logoutLoading}>
                    {logoutLoading ? (
                      <span className="d-flex align-items-center gap-1">
                        <span className="spinner-border spinner-border-sm" role="status" />
                        Logging out...
                      </span>
                    ) : (
                      "Logout"
                    )}
                  </button>
                  {user?.avatar && (
                    <Link to={`/profile/${user?.profile?.handle || user?._id}`}>
                      <img
                        src={user?.avatar}
                        alt="User Avatar"
                        className="rounded-circle ms-2"
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        title={user?.name}
                      />
                    </Link>
                  )}
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
