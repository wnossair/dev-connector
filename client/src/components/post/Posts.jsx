import React, { useEffect } from "react";
import PostForm from "./PostForm";
import { usePostListStore } from "../../stores/usePostListStore";
import { Spinner } from "../common/Feedback";
import PostFeed from "./PostFeed";
import { postApi } from "../../api/postApi";

export default function Posts() {
  const { posts, loading, error, setPosts, setLoading, setError, clearError } = usePostListStore();

  useEffect(() => {
    const loadPosts = async () => {
      clearError();
      setLoading(true);
      try {
        const postsData = await postApi.getPosts();
        setPosts(postsData);
      } catch (err) {
        // Use the actual error from the API call
        const errorMessage = err.response?.data?.message || err.message || "Failed to load posts";
        setError({
          message: errorMessage,
          details: err.response?.data?.error || null,
        });
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
            <strong>Error:</strong> {error.message}
            {error.details && (
              <div className="mt-2">
                <small>{JSON.stringify(error.details)}</small>
              </div>
            )}
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
