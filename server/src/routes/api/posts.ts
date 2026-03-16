import express, { Request, Response } from "express";
import passport from "passport";
import mongoose from "mongoose";
import { postValidation, commentValidation } from "../../middleware/validation.js";
import { sendSuccess } from "../../utils/responseHandler.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { NotFoundError, AuthorizationError, ConflictError } from "../../errors/AppError.js";
import { Post } from "../../models/Post.js";
import { ICreatePostRequest, ICreateCommentRequest } from "../../types/index.js";

const router = express.Router();

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get("/test", (req: Request, res: Response) => {
  sendSuccess(res, 200, "Posts Works");
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const posts = await Post.find().sort({ date: -1 }).populate("user", ["name", "avatar"]);
    sendSuccess(res, 200, "Posts fetched successfully", { posts });
  }),
);

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.id).populate("user", ["name", "avatar"]);
    if (!post) throw new NotFoundError("Post");
    sendSuccess(res, 200, "Post fetched successfully", { post });
  }),
);

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postValidation,
  validateRequest,
  asyncHandler(async (req: Request<{}, {}, ICreatePostRequest>, res: Response) => {
    const newPost = new Post({
      text: req.body.text,
      name: req.user!.name,
      avatar: req.user!.avatar,
      user: req.user!.id,
    });
    const post = await newPost.save();
    sendSuccess(res, 201, "Post created successfully", { post });
  }),
);

// @route   DELETE api/posts/:id
// @desc    Delete post by ID
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.id);
    if (!post) throw new NotFoundError("Post");
    if (post.user.toString() !== req.user!.id) {
      throw new AuthorizationError("You are not authorized to delete this post");
    }
    await post.deleteOne();
    sendSuccess(res, 200, "Post removed successfully");
  }),
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // Atomically add like only if the user has not already liked the post.
    // A single findOneAndUpdate avoids the read-modify-save race condition.
    const updated = await Post.findOneAndUpdate(
      { _id: req.params.id, "likes.user": { $ne: userId } },
      { $push: { likes: { user: userId } } },
      { new: true },
    );

    if (!updated) {
      // Distinguish "post not found" from "already liked"
      const exists = await Post.exists({ _id: req.params.id });
      if (!exists) throw new NotFoundError("Post");
      throw new ConflictError("Post already liked");
    }

    sendSuccess(res, 200, "Post liked successfully", { postId: updated._id, likes: updated.likes });
  }),
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    // Atomically remove like only if the user has actually liked the post.
    const updated = await Post.findOneAndUpdate(
      { _id: req.params.id, "likes.user": userId },
      { $pull: { likes: { user: userId } } },
      { new: true },
    );

    if (!updated) {
      const exists = await Post.exists({ _id: req.params.id });
      if (!exists) throw new NotFoundError("Post");
      throw new ConflictError("Post has not been liked yet");
    }

    sendSuccess(res, 200, "Post unliked successfully", {
      postId: updated._id,
      likes: updated.likes,
    });
  }),
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  commentValidation,
  validateRequest,
  asyncHandler(
    async (req: Request<Record<string, string>, {}, ICreateCommentRequest>, res: Response) => {
      const post = await Post.findById(req.params.id);
      if (!post) throw new NotFoundError("Post");

      const newComment: any = {
        text: req.body.text,
        name: req.user!.name,
        avatar: req.user!.avatar,
        user: req.user!.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      sendSuccess(res, 201, "Comment added successfully", { comments: post.comments });
    },
  ),
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.comment_id)) {
      throw new NotFoundError("Comment");
    }

    const post = await Post.findById(req.params.id);
    if (!post) throw new NotFoundError("Post");

    const comment = post.comments.find((comment: any) => comment.id === req.params.comment_id);
    if (!comment) throw new NotFoundError("Comment");

    if (comment.user.toString() !== req.user!.id) {
      throw new AuthorizationError("You are not authorized to delete this comment");
    }

    post.comments = post.comments.filter(({ id }: any) => id !== req.params.comment_id);
    await post.save();
    sendSuccess(res, 200, "Comment deleted successfully", { comments: post.comments });
  }),
);

export default router;
