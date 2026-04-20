import express, { Request, Response } from "express";
import passport from "passport";
import { postValidation, commentValidation } from "../../middleware/validation.js";
import { sendSuccess } from "../../utils/responseHandler.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { ICreatePostRequest, ICreateCommentRequest } from "../../types/index.js";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getAllPosts,
  getPostById,
  likePost,
  unlikePost,
} from "../../services/postService.js";

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
    const posts = await getAllPosts();
    sendSuccess(res, 200, "Posts fetched successfully", { posts });
  }),
);

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const post = await getPostById(req.params.id);
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
    const post = await createPost(req.user!, req.body.text);
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
    await deletePost(req.user!.id, req.params.id);
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
    const result = await likePost(req.user!.id, req.params.id);
    sendSuccess(res, 200, "Post liked successfully", result);
  }),
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await unlikePost(req.user!.id, req.params.id);
    sendSuccess(res, 200, "Post unliked successfully", result);
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
      const result = await addComment(req.user!, req.params.id, req.body.text);
      sendSuccess(res, 201, "Comment added successfully", result);
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
    const result = await deleteComment(req.user!.id, req.params.id, req.params.comment_id);
    sendSuccess(res, 200, "Comment deleted successfully", result);
  }),
);

export default router;
