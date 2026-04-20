import mongoose from "mongoose";

import { AuthorizationError, ConflictError, NotFoundError } from "../errors/AppError.js";
import { Post } from "../models/Post.js";
import type { IComment, ILike, IPost, IUser } from "../types/models.js";

const loadPost = async (postId: string): Promise<IPost> => {
  const post = await Post.findById(postId).populate("user", ["name", "avatar"]);

  if (!post) {
    throw new NotFoundError("Post");
  }

  return post;
};

export const getAllPosts = async (): Promise<IPost[]> => {
  return Post.find().sort({ date: -1 }).populate("user", ["name", "avatar"]);
};

export const getPostById = async (postId: string): Promise<IPost> => {
  return loadPost(postId);
};

export const createPost = async (user: IUser, text: string): Promise<IPost> => {
  const newPost = new Post({
    text,
    name: user.name,
    avatar: user.avatar,
    user: user.id,
  });

  return newPost.save();
};

export const deletePost = async (userId: string, postId: string): Promise<void> => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("Post");
  }

  if (post.user.toString() !== userId) {
    throw new AuthorizationError("You are not authorized to delete this post");
  }

  await post.deleteOne();
};

export const likePost = async (
  userId: string,
  postId: string,
): Promise<{ postId: string; likes: ILike[] }> => {
  const updated = await Post.findOneAndUpdate(
    { _id: postId, "likes.user": { $ne: userId } },
    { $push: { likes: { user: userId } } },
    { new: true },
  );

  if (!updated) {
    const exists = await Post.exists({ _id: postId });
    if (!exists) {
      throw new NotFoundError("Post");
    }
    throw new ConflictError("Post already liked");
  }

  return { postId: updated._id.toString(), likes: updated.likes };
};

export const unlikePost = async (
  userId: string,
  postId: string,
): Promise<{ postId: string; likes: ILike[] }> => {
  const updated = await Post.findOneAndUpdate(
    { _id: postId, "likes.user": userId },
    { $pull: { likes: { user: userId } } },
    { new: true },
  );

  if (!updated) {
    const exists = await Post.exists({ _id: postId });
    if (!exists) {
      throw new NotFoundError("Post");
    }
    throw new ConflictError("Post has not been liked yet");
  }

  return { postId: updated._id.toString(), likes: updated.likes };
};

export const addComment = async (
  user: IUser,
  postId: string,
  text: string,
): Promise<{ postId: string; comments: IComment[] }> => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("Post");
  }

  const newComment: IComment = {
    text,
    name: user.name,
    avatar: user.avatar,
    user: user._id,
    date: new Date(),
  };

  post.comments.unshift(newComment);
  await post.save();

  return { postId: post._id.toString(), comments: post.comments };
};

export const deleteComment = async (
  userId: string,
  postId: string,
  commentId: string,
): Promise<{ postId: string; comments: IComment[] }> => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new NotFoundError("Comment");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("Post");
  }

  const comment = post.comments.find(item => item._id?.toString() === commentId);
  if (!comment) {
    throw new NotFoundError("Comment");
  }

  if (comment.user.toString() !== userId) {
    throw new AuthorizationError("You are not authorized to delete this comment");
  }

  post.comments = post.comments.filter(item => item._id?.toString() !== commentId);
  await post.save();

  return { postId: post._id.toString(), comments: post.comments };
};
