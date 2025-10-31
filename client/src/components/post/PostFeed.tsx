import { memo } from "react";
import PostItem from "./PostItem";
import { Link } from "react-router-dom";
import type { Post } from "../../types";

interface PostFeedProps {
  posts?: Post[];
}

const PostFeed = ({ posts }: PostFeedProps) => {
  const hasItems = <T,>(array?: T[]): array is T[] =>
    array != null && Array.isArray(array) && array.length > 0;

  if (!hasItems(posts)) {
    return (
      <div className="container">
        <h1 className="display-4">No posts to show</h1>
        <Link to="/dashboard" className="btn btn-dark">
          Go To Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="posts">
      {posts.map(post => (
        <PostItem post={post} key={post._id} />
      ))}
    </div>
  );
};

export default memo(PostFeed);
