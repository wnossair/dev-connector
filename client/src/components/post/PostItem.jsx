import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PostItem = ({ post }) => {
  const { user } = useSelector(state => state.auth);

  const displayName = post.name?.includes(" ") ? post.name.split(" ")[0] : post.name;

  const onDeleteClick = id => {
    console.log(id);
  };

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
            <button type="button" className="btn btn-light me-2">
              <i className="bi bi-hand-thumbs-up text-info"></i>
              <span className="badge bg-light text-dark ms-1">{post.likes.length}</span>
            </button>
            <button type="button" className="btn btn-light me-2">
              <i className="bi bi-hand-thumbs-down text-secondary"></i>
            </button>
            <Link to={`/post/${post._id}`} className="btn btn-info me-2">
              Comments
            </Link>
            {post.user === user.id && (
              <button
                type="button"
                className="btn btn-danger me-1"
                onClick={() => onDeleteClick(post._id)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
