import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCurrentPostStore } from "../../stores/useCurrentPostStore";
import { Spinner } from "../common/Feedback";
import { postApi } from "../../api/postApi";

export default function SinglePost() {
  const { id } = useParams();
  const { current, loading, error, setCurrentPost, setLoading, setError, clearError } =
    useCurrentPostStore();

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      setLoading(true);
      clearError();
      try {
        const post = await postApi.getPost(id);
        setCurrentPost(post);
      } catch (err) {
        // Use the actual error from the API call
        const errorMessage = err.response?.data?.message || err.message || "Failed to load post";
        const errorDetails = err.response?.data?.error || null;

        setError({
          message: errorMessage,
          details: errorDetails,
        });
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, setCurrentPost, setLoading, setError, clearError]);

  if (loading) {
    return (
      <div className="container">
        <Spinner />
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          <strong>Error:</strong> {error.message}
          {error.details && (
            <div className="mt-2">
              <small>{JSON.stringify(error.details)}</small>
            </div>
          )}
        </div>
        <Link to="/posts" className="btn btn-primary">
          Back to Posts
        </Link>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="container">
        <div className="alert alert-warning">Post not found</div>
        <Link to="/posts" className="btn btn-primary">
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <Link to="/posts" className="btn btn-light mb-3">
            Back To Posts
          </Link>

          <div className="card card-body mb-3">
            <div className="row">
              <div className="col-md-2">
                <img
                  className="rounded-circle d-none d-md-block"
                  src={current.avatar}
                  alt={current.name}
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <p className="text-center mt-2">{current.name}</p>
              </div>
              <div className="col-md-10">
                <p className="lead">{current.text}</p>
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-light me-2">
                    <i className="bi bi-hand-thumbs-up text-info"></i>
                    <span className="badge bg-light text-dark ms-1">
                      {current.likes.length} likes
                    </span>
                  </button>
                  <span className="text-muted">{new Date(current.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments section can be added here */}
        </div>
      </div>
    </div>
  );
}
