import { Link } from "react-router-dom";
import { usePostListStore } from "../../stores/usePostListStore";
import { postApi } from "../../api/postApi";
import { syncPostUpdates, syncPostDeletion } from "../../stores/syncPostStores";
import { useAuthStore } from "../../stores/useAuthStore";
import type { Post } from "../../types";

interface PostItemProps {
  post: Post;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

const PostItem = ({ post }: PostItemProps) => {
  const user = useAuthStore(state => state.user);
  const { loading, setError, setLoading } = usePostListStore();

  const displayName = post.name?.includes(" ") ? post.name.split(" ")[0] : post.name;
  const postOwnerId = typeof post.user === "string" ? post.user : post.user?._id;

  const onDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setLoading(true);
      try {
        await postApi.deletePost(id);
        syncPostDeletion(id);
      } catch (error) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || err.message || "Failed to delete post";
        setError(errorMessage);
        console.log("Error:", err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    }
  };

  const onLikeClick = async (id: string) => {
    setLoading(true);
    try {
      const { postId, likes } = await postApi.likePost(id);
      syncPostUpdates(postId, { likes });
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || "Failed to like post";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onUnlikeClick = async (id: string) => {
    setLoading(true);
    try {
      const { postId, likes } = await postApi.unlikePost(id);
      syncPostUpdates(postId, { likes });
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || "Failed to unlike post";
      setError(errorMessage);
      console.log("Error:", err.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const hasLiked = post.likes?.some(like => like.user === user?._id) || false;

  return (
    <div className="card card-body mb-3">
      <div className="row">
        <div className="col-md-2">
          <Link
            to={`/profile/user/${postOwnerId}`}
            className="d-block mb-3 d-flex justify-content-center"
          >
            <img
              className="avatar avatar-md"
              src={post.avatar}
              alt={displayName}
              title={post.name}
            />
          </Link>
          <p className="text-center mb-0 text-muted">{displayName}</p>
        </div>
        <div className="col-md-10">
          <p className="lead mb-4">{post.text}</p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <button
              type="button"
              className={`btn btn-sm ${hasLiked ? "btn-primary" : "btn-light"}`}
              onClick={() => (hasLiked ? onUnlikeClick(post._id) : onLikeClick(post._id))}
              disabled={loading}
              title={hasLiked ? "Unlike post" : "Like post"}
            >
              <i className="bi bi-hand-thumbs-up"></i>
              <span className="ms-2">{post.likes.length}</span>
            </button>
            <Link to={`/post/${post._id}`} className="btn btn-sm btn-secondary">
              <i className="bi bi-chat-left"></i>
              Comments
            </Link>
            {postOwnerId === user?._id && (
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => post._id && onDeleteClick(post._id)}
                disabled={loading}
                title="Delete post"
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
            {loading && (
              <span className="text-muted ms-2">
                <span
                  className="spinner spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
