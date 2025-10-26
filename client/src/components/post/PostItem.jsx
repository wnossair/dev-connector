import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { usePostsStore } from "../../stores/usePostStore";
import { postApi } from "../../api/postApi";
import { syncPostUpdates, syncPostDeletion } from "../../stores/syncPostStores";

const PostItem = ({ post }) => {
  const { user } = useSelector(state => state.auth);
  const { loading, setError, setLoading } = usePostsStore();

  const displayName = post.name?.includes(" ") ? post.name.split(" ")[0] : post.name;

  const onDeleteClick = async id => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setLoading(true);
      try {
        await postApi.deletePost(id);
        syncPostDeletion(id);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to delete post";
        setError({
          message: errorMessage,
          details: err.response?.data?.error || null,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const onLikeClick = async id => {
    setLoading(true);
    try {
      const { postId, likes } = await postApi.likePost(id);
      syncPostUpdates(postId, { likes });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to like post";
      setError({
        message: errorMessage,
        details: err.response?.data?.error || null,
      });
    } finally {
      setLoading(false);
    }
  };

  const onUnlikeClick = async id => {
    setLoading(true);
    try {
      const { postId, likes } = await postApi.unlikePost(id);
      syncPostUpdates(postId, { likes });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to unlike post";
      setError({
        message: errorMessage,
        details: err.response?.data?.error || null,
      });
    } finally {
      setLoading(false);
    }
  };

  const hasLiked = post.likes.some(like => like.user === user.id);

  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-md-2 text-center">
          <Link to="/profile" className="d-block mb-2">
            <div className="d-flex justify-content-center">
              <img
                className="rounded-circle"
                src={post.avatar}
                alt={displayName}
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                title={post.name}
              />
            </div>
          </Link>
          <p className="mb-0">{displayName}</p>
        </div>
        <div className="col-md-10">
          <p className="lead">{post.text}</p>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-light me-2"
              onClick={() => (hasLiked ? onUnlikeClick(post._id) : onLikeClick(post._id))}
              disabled={loading}
            >
              <i
                className={`bi bi-hand-thumbs-up ${hasLiked ? "text-info" : "text-secondary"}`}
              ></i>
              <span className="badge bg-light text-dark ms-1">{post.likes.length}</span>
            </button>
            <Link to={`/post/${post._id}`} className="btn btn-info me-2">
              Comments
            </Link>
            {post.user === user.id && (
              <button
                type="button"
                className="btn btn-danger me-1"
                onClick={() => onDeleteClick(post._id)}
                disabled={loading}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
          {loading && (
            <div className="mt-2">
              <small className="text-muted">Processing...</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
