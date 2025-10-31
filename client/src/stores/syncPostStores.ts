import { Post } from "../types";
import { usePostListStore } from "./usePostListStore";
import { usePostStore } from "./usePostStore";

/**
 * Helper to sync updates between list and single post stores
 * @param postId - The ID of the post to update
 * @param updates - Partial post updates to apply
 */
export const syncPostUpdates = (postId: string, updates: Partial<Post>): void => {
  // Update in posts list
  usePostListStore.getState().updatePost(postId, updates);

  // Update in single post if it's the same post
  const currentPost = usePostStore.getState().post;
  if (currentPost && currentPost._id === postId) {
    usePostStore.getState().updatePost(updates);
  }
};

/**
 * Helper to sync deletion between list and single post stores
 * @param postId - The ID of the post to delete
 */
export const syncPostDeletion = (postId: string): void => {
  // Delete from posts list
  usePostListStore.getState().deletePost(postId);

  // Clear single post if it's the same post
  const currentPost = usePostStore.getState().post;
  if (currentPost && currentPost._id === postId) {
    usePostStore.getState().clearPost();
  }
};
