import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { clearProfile } from "../../features/profile/profileSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const logout = async () => {
    try {
      dispatch(logoutUser());
      dispatch(clearProfile());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const authLinks = (
    <>
      <li className="nav-item pe-2">
        <Link className="nav-link" to="/feed">
          Post Feed
        </Link>
      </li>
      <li className="nav-item pe-2">
        <Link className="nav-link" to="/dashboard">
          Dashboard
        </Link>
      </li>
      <li className="nav-item pe-2">
        <Link className="nav-link" to="/profile">
          Profile
        </Link>
      </li>
      <li className="nav-item d-flex align-items-center">
        <button className="nav-link" onClick={logout}>
          Logout
        </button>
        {user?.avatar && (
          <Link to="/profile" className="ms-2 d-none d-md-inline-block">
            <img
              src={user?.avatar}
              alt="User Avatar"
              className="rounded-circle"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "cover",
              }}
              title={user?.name}
            />
          </Link>
        )}
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item pe-2">
        <Link className="nav-link" to="/register">
          Sign Up
        </Link>
      </li>
      <li className="nav-item pe-2">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4 px-2">
      <div className="container-fluid px-1">
        <Link className="navbar-brand" to="/">
          Developer Social Network
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
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

          <ul className="navbar-nav ms-auto">{isAuthenticated ? authLinks : guestLinks}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
