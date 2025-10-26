import React, { useEffect } from "react";
import PostForm from "./PostForm";
import { useDispatch, useSelector } from "react-redux";
import { loadAllPosts } from "../../features/post/postSlice";
import { Spinner } from "../common/Feedback";
import PostFeed from "./PostFeed";

export default function Posts() {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector(state => state.post);
  const error = useSelector(state => state.error);

  useEffect(() => {
    dispatch(loadAllPosts());
  }, [dispatch]);

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
            {error.message || "An error occurred while loading posts."}
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
