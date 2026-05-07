import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-4">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="btn-group" role="group">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
