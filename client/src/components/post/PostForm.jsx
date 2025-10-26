import React, { useState } from "react";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { usePostsStore } from "../../stores/usePostStore";
import { useSelector } from "react-redux";
import { postApi } from "../../api/postApi";

const PostForm = () => {
  const { user } = useSelector(state => state.auth);
  const { addPost, setError, clearError } = usePostsStore();

  const [postText, setPostText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const onSubmit = async e => {
    e.preventDefault();
    if (!postText.trim()) return;

    setSubmitting(true);
    clearError();
    setFormError("");

    try {
      const postData = {
        text: postText,
        name: user.name,
        avatar: user.avatar,
      };
      const newPost = await postApi.createPost(postData);
      addPost(newPost);
      setPostText("");
    } catch (err) {
      // Use the actual error from the API call
      const errorMessage = err.response?.data?.message || err.message || "Failed to create post";
      const errorDetails = err.response?.data?.error || null;

      setError({
        message: errorMessage,
        details: errorDetails,
      });
      setFormError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const onChange = e => {
    setPostText(e.target.value);
    if (formError) setFormError("");
  };

  return (
    <div className="post-form mb-3">
      <div className="card card-info">
        <div className="card-header bg-primary text-white">Say Something...</div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <TextAreaFieldGroup
                className="form-control form-control-lg"
                name="postText"
                value={postText}
                placeholder="Create a post"
                id="postText"
                error={formError}
                onChange={onChange}
              />
            </div>
            <button
              type="submit"
              className="btn btn-dark"
              disabled={submitting || !postText.trim()}
            >
              {submitting ? "Posting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
