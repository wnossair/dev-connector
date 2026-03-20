import { useEffect, useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { usePostStore } from "../../stores/usePostStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { syncPostUpdates } from "../../stores/syncPostStores";
import { Spinner } from "../common/Feedback";
import { postApi } from "../../api/postApi";
import type { Like } from "../../types";
import { extractErrorMessage } from "../../utils/error";

export default function SinglePost() {
  const { id } = useParams();
  const user = useAuthStore(state => state.user);
  const { post, loading, error, setPost, setLoading, setError, clearError } = usePostStore();
  const [actionLoading, setActionLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const hasLiked = post?.likes?.some(like => like.user === user?._id) || false;

  const onLikeToggle = async () => {
    if (!post?._id || actionLoading) return;
    if (!user?._id) {
      setError("You must be logged in to like posts");
      return;
    }

    const previousLikes = post.likes;
    const optimisticLikes: Like[] = hasLiked
      ? post.likes.filter(like => like.user !== user._id)
      : [...post.likes, { user: user._id }];

    setActionLoading(true);
    syncPostUpdates(post._id, { likes: optimisticLikes });
    try {
      const { postId, likes } = hasLiked
        ? await postApi.unlikePost(post._id)
        : await postApi.likePost(post._id);
      syncPostUpdates(postId, { likes });
    } catch (error) {
      syncPostUpdates(post._id, { likes: previousLikes });
      setError(extractErrorMessage(error, "Failed to update like"));
    } finally {
      setActionLoading(false);
    }
  };

  const onCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!post?._id || commentLoading) return;

    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      setError("Comment text is required");
      return;
    }

    setCommentLoading(true);
    try {
      const { postId, comments } = await postApi.addComment(post._id, { text: trimmedComment });
      syncPostUpdates(postId, { comments });
      setCommentText("");
    } catch (error) {
      setError(extractErrorMessage(error, "Failed to add comment"));
    } finally {
      setCommentLoading(false);
    }
  };

  const onDeleteComment = async (commentId: string) => {
    if (!post?._id || commentLoading) return;

    setCommentLoading(true);
    try {
      const { postId, comments } = await postApi.deleteComment(post._id, commentId);
      syncPostUpdates(postId, { comments });
    } catch (error) {
      setError(extractErrorMessage(error, "Failed to delete comment"));
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      clearError();
      setLoading(true);
      try {
        const postData = await postApi.getPost(id);
        setPost(postData);
      } catch (error) {
        setError(extractErrorMessage(error, "Failed to load post"));
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
            <div className="row g-3 align-items-start">
              <div className="col-md-3 col-lg-2 d-flex flex-column align-items-center text-center">
                <img
                  className="rounded-circle d-none d-md-block single-post-avatar mx-auto"
                  src={post.avatar}
                  alt={post.name}
                />
                <p className="mt-2 mb-0">{post.name}</p>
              </div>
              <div className="col-md-9 col-lg-10">
                <p className="lead single-post-text">{post.text}</p>
                <div className="d-flex align-items-center flex-wrap gap-2 single-post-actions">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={onLikeToggle}
                    disabled={actionLoading}
                  >
                    <i
                      className={`bi bi-hand-thumbs-up ${hasLiked ? "text-info" : "text-secondary"}`}
                    ></i>
                    <span className="badge bg-light text-dark ms-1">{post.likes.length} likes</span>
                  </button>
                  <span className="text-muted text-break">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>
                {actionLoading && <small className="text-muted d-block mt-2">Processing...</small>}
              </div>
            </div>
          </div>

          <div className="card card-body mb-3">
            <h5 className="mb-3">Comments</h5>

            <form onSubmit={onCommentSubmit} className="mb-4">
              <div className="mb-2">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={event => setCommentText(event.target.value)}
                  disabled={commentLoading}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={commentLoading}>
                Add Comment
              </button>
            </form>

            {post.comments.length === 0 && <p className="text-muted mb-0">No comments yet.</p>}

            {post.comments.map(comment => (
              <div key={comment._id} className="border-top pt-3 mt-3">
                <div className="d-flex align-items-start">
                  <img
                    src={comment.avatar}
                    alt={comment.name}
                    className="rounded-circle me-3"
                    style={{ width: "48px", height: "48px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <strong>{comment.name}</strong>
                      <small className="text-muted">
                        {new Date(comment.date).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="mb-0 mt-1 single-post-text">{comment.text}</p>
                  </div>

                  {comment.user === user?._id && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger ms-3"
                      onClick={() => onDeleteComment(comment._id)}
                      disabled={commentLoading}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
