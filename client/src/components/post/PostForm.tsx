import { useState, FormEvent } from "react";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { usePostListStore } from "../../stores/usePostListStore";
import { useAppSelector } from "../../hooks/reduxHooks";
import { postApi } from "../../api/postApi";
import type { InputChangeHandler } from "../../types";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

const PostForm = () => {
  const { user } = useAppSelector(state => state.auth);
  const { addPost, setError, clearError } = usePostListStore();

  const [postText, setPostText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postText.trim()) return;

    setSubmitting(true);
    clearError();
    setFormError("");

    try {
      const postData = {
        text: postText,
        name: user?.name || "",
        avatar: user?.avatar || "",
      };
      const newPost = await postApi.createPost(postData);
      addPost(newPost);
      setPostText("");
    } catch (error) {
      // Use the actual error from the API call
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || err.message || "Failed to create post";
      const errorDetails = err.response?.data?.error || null;

      setError(errorMessage);
      setFormError(errorMessage);
      console.log("Error details:", errorDetails);
    } finally {
      setSubmitting(false);
    }
  };

  const onChange: InputChangeHandler = e => {
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
