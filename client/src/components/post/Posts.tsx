import { useEffect } from "react";
import PostForm from "./PostForm";
import { usePostListStore } from "../../stores/usePostListStore";
import { Spinner } from "../common/Feedback";
import PostFeed from "./PostFeed";
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

export default function Posts() {
  const { posts, loading, error, setPosts, setLoading, setError, clearError } = usePostListStore();

  useEffect(() => {
    const loadPosts = async () => {
      clearError();
      setLoading(true);
      try {
        const postsData = await postApi.getPosts();
        setPosts(postsData);
      } catch (error) {
        // Use the actual error from the API call
        const err = error as ApiError;
        const errorMessage = err.response?.data?.message || err.message || "Failed to load posts";
        setError(errorMessage);
        console.log("Error details:", err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [setPosts, setLoading, setError, clearError]);

  if (loading) {
    return (
      <div className="feed">
        <div className="container">
          <Spinner />
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed">
        <div className="container">
          <div className="alert alert-danger">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="container">
        <PostForm />
        <PostFeed posts={posts} />
      </div>
    </div>
  );
}
