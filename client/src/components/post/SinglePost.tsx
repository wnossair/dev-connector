import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePostStore } from "../../stores/usePostStore";
import { Spinner } from "../common/Feedback";
import { postApi } from "../../api/postApi";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

export default function SinglePost() {
  const { id } = useParams();
  const { post, loading, error, setPost, setLoading, setError, clearError } = usePostStore();

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      clearError();
      setLoading(true);
      try {
        const postData = await postApi.getPost(id);
        setPost(postData);
      } catch (error) {
        // Use the actual error from the API call
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || err.message || "Failed to load post";

        setError(errorMessage);
        console.log("Error details:", err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, setPost, setLoading, setError, clearError]);

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
          <strong>Error:</strong> {error}
        </div>
        <Link to="/posts" className="btn btn-primary">
          Back to Posts
        </Link>
      </div>
    );
  }

  if (!post) {
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
                  src={post.avatar}
                  alt={post.name}
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <p className="text-center mt-2">{post.name}</p>
              </div>
              <div className="col-md-10">
                <p className="lead">{post.text}</p>
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-light me-2">
                    <i className="bi bi-hand-thumbs-up text-info"></i>
                    <span className="badge bg-light text-dark ms-1">{post.likes.length} likes</span>
                  </button>
                  <span className="text-muted">{new Date(post.date).toLocaleDateString()}</span>
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
