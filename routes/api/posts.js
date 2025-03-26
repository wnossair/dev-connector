const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post Specific imports
const Post = require("../../models/Post");
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err =>
      res
        .status(404)
        .json({ post_error: `${err}: No posts found with that id.` })
    );
});

// @route   GET api/posts/:id
// @desc    Get all posts
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({
          post_error: `${req.params.id}: No post found with that id.`,
        });
      }
      res.json(post);
    })
    .catch(err =>
      res
        .status(404)
        .json({ post_error: `${err}: No post found with that id.` })
    );
});

// @route   POST api/posts
// @desc    Create posts
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post by ID
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ _id: req.params.id })
      .populate("user", "_id")
      .then(post => {
        if (post.user.id !== req.user.id) {
          return res
            .status(401)
            .json({ user_error: "Operation forbidden: Not post owner" });
        }

        Post.deleteOne({ _id: req.params.id })
          .then(result => {
            if (result.acknowledged) {
              return res.json({ sucess: true });
            }
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

//////////////////////////////////////////////////////////////////////
// THE FOLLOWING CODE FOLLOWS THE LATEST BEST PRACTICES NOT THE COURSE
//////////////////////////////////////////////////////////////////////

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: { user: req.user.id } } },
        { new: true }
      ).lean();

      if (!updatedPost) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "Post not found",
        });
      }

      res.status(200).json({
        success: true,
        post: updatedPost,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "SERVER_ERROR",
        message: err.message,
      });
    }
  }
);

// @route   DELETE api/posts/like/:id
// @desc    Delete a like on a post
// @access  Private
router.delete(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: { user: req.user.id } } },
        { new: true }
      ).lean();

      if (!updatedPost) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "Post not found",
        });
      }

      res.status(200).json({
        success: true,
        post: updatedPost,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "SERVER_ERROR",
        message: err.message,
      });
    }
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add a conmment to a post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { errors, isValid } = validatePostInput(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: {
            comments: {
              user: req.user.id,
              name: req.body.name,
              avatar: req.body.avatar,
              text: req.body.text,
            },
          },
        },
        { new: true }
      ).lean();

      if (!updatedPost) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "Post not found",
        });
      }

      res.status(200).json({
        success: true,
        post: updatedPost,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "SERVER_ERROR",
        message: err.message,
      });
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment on post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { comments: { _id: req.params.comment_id } } },
        { new: true }
      ).lean();

      if (!updatedPost) {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "Post not found",
        });
      }

      res.status(200).json({
        success: true,
        post: updatedPost,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "SERVER_ERROR",
        message: err.message,
      });
    }
  }
);

module.exports = router;
