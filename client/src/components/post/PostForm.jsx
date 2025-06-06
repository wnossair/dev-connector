import React, { useEffect, useState } from "react";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { useDispatch, useSelector } from "react-redux";
import { clearAppError } from "../../features/error/errorSlice";
import { addPost } from "../../features/post/postSlice";

const PostForm = () => {
  const dispatch = useDispatch();
  const appError = useSelector(state => state.error);
  const { user } = useSelector(state => state.auth);

  const [postText, setPostText] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    dispatch(clearAppError());
    setErrorText("");
  }, [dispatch]);

  useEffect(() => {
    if (appError?.text) {
      setErrorText(appError.text);
    }
  }, [appError, postText]);

  const onChange = e => {
    setPostText(e.target.value);
    dispatch(clearAppError());
    setErrorText("");
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const postData = {
        text: postText,
        name: user.name,
        avatar: user.avatar,
      };
      await dispatch(addPost(postData)).unwrap();
      setPostText("");
    } catch (err) {
      console.error("Post error:", err);
    }
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
                error={errorText}
                onChange={onChange}
              />
            </div>
            <button type="submit" className="btn btn-dark">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
