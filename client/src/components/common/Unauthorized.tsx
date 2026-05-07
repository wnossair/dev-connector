import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-warning">403</h1>
        <h2 className="mb-4">Access Denied</h2>
        <p className="lead mb-4">
          You don't have permission to access this page. Please log in to continue.
        </p>
        <div className="btn-group" role="group">
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
          <Link to="/" className="btn btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
