import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useProfileStore } from "../../stores/useProfileStore";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const logoutUser = useAuthStore(state => state.logout);
  const clearProfile = useProfileStore(state => state.clearProfile);

  const logout = async () => {
    try {
      logoutUser();
      clearProfile();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const authLinks = (
    <>
      <li className="nav-item pe-2">
        <Link className="nav-link" to="/posts">
          Posts
        </Link>
      </li>
      <li className="nav-item pe-2">
        <Link className="nav-link" to="/dashboard">
          Dashboard
        </Link>
      </li>
      <li className="nav-item pe-2">
        <Link className="nav-link" to={user ? `/profile/user/${user._id}` : "/dashboard"}>
          Profile
        </Link>
      </li>
      <li className="nav-item d-flex align-items-center">
        <button className="nav-link" onClick={logout}>
          Logout
        </button>
        {user?.avatar && (
          <Link to={`/profile/user/${user._id}`} className="ms-2 d-none d-md-inline-block">
            <img
              src={user?.avatar}
              alt="User Avatar"
              className="avatar avatar-sm"
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
        <Link className="navbar-brand" to="/" title="DevConnector Home">
          <i className="bi bi-house-door-fill"></i>
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
