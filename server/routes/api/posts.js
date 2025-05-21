import express from "express";
import passport from "passport";
import { validationResult } from "express-validator";
import { postValidation } from "../../middleware/validation.js"; // Assuming comment validation is similar
import { sendSuccess, sendError, handleValidationErrors } from "../../utils/responseHandler.js";

import Post from "../../models/Post.js";
// User model might be needed if you decide to populate user details in posts more extensively
// import User from "../../models/User.js";

const router = express.Router();

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get("/test", (req, res) => sendSuccess(res, 200, "Posts Works"));

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    sendSuccess(res, 200, "Posts fetched successfully", { posts });
  } catch (err) {
    next(err);
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return sendError(res, 404, "Post not found");
    }
    sendSuccess(res, 200, "Post fetched successfully", { post });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return sendError(res, 404, "Post not found (invalid ID format)");
    }
    next(err);
  }
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleValidationErrors(res, errors);
    }
    try {
      const newPost = new Post({
        text: req.body.text,
        name: req.user.name, // Use authenticated user's name
        avatar: req.user.avatar, // Use authenticated user's avatar
        user: req.user.id,
      });
      const post = await newPost.save();
      sendSuccess(res, 201, "Post created successfully", { post });
    } catch (err) {
      next(err);
    }
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post by ID
// @access  Private
router.delete("/:id", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return sendError(res, 404, "Post not found");
    }

    if (post.user.toString() !== req.user.id) {
      return sendError(res, 401, "User not authorized to delete this post");
    }
    await post.deleteOne();
    sendSuccess(res, 200, "Post removed successfully");
  } catch (err) {
    if (err.kind === "ObjectId") {
      return sendError(res, 404, "Post not found (invalid ID format)");
    }
    next(err);
  }
});

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return sendError(res, 404, "Post not found");
      }

      if (post.likes.some(like => like.user.toString() === req.user.id)) {
        return sendError(res, 400, "Post already liked by this user");
      }
      post.likes.unshift({ user: req.user.id });
      await post.save();
      sendSuccess(res, 200, "Post liked successfully", { likes: post.likes });
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return sendError(res, 404, "Post not found");
      }

      if (!post.likes.some(like => like.user.toString() === req.user.id)) {
        return sendError(res, 400, "Post has not yet been liked by this user");
      }
      post.likes = post.likes.filter(({ user }) => user.toString() !== req.user.id);
      await post.save();
      sendSuccess(res, 200, "Post unliked successfully", { likes: post.likes });
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  postValidation, // Using postValidation for comment text, adjust if different rules apply
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleValidationErrors(res, errors, "Comment validation failed");
    }
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return sendError(res, 404, "Post not found");
      }

      const newComment = {
        text: req.body.text,
        name: req.user.name, // Use authenticated user's name
        avatar: req.user.avatar, // Use authenticated user's avatar
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      sendSuccess(res, 201, "Comment added successfully", { comments: post.comments });
    } catch (err) {
      next(err);
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return sendError(res, 404, "Post not found");
      }

      const comment = post.comments.find(comment => comment.id === req.params.comment_id);
      if (!comment) {
        return sendError(res, 404, "Comment does not exist");
      }

      if (comment.user.toString() !== req.user.id) {
        return sendError(res, 401, "User not authorized to delete this comment");
      }
      post.comments = post.comments.filter(({ id }) => id !== req.params.comment_id);
      await post.save();
      sendSuccess(res, 200, "Comment deleted successfully", { comments: post.comments });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
