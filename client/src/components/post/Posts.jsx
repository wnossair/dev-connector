import React, { useEffect } from "react";
import PostForm from "./PostForm";
import { useDispatch, useSelector } from "react-redux";
import { loadAllPosts } from "../../features/post/postSlice";
import { Spinner } from "../common/Feedback";
import PostFeed from "./PostFeed";

export default function Posts() {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector(state => state.post);

  useEffect(() => {
    dispatch(loadAllPosts());
  }, [dispatch]);

  if (loading) {
    return <Spinner />;
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
