import { usePostListStore } from "./usePostListStore";
import { usePostStore } from "./usePostStore";

// Helper to sync updates between list and single post
export const syncPostUpdates = (postId, updates) => {
  // Update in posts list
  usePostListStore.getState().updatePost(postId, updates);

  // Update in single post if it's the same post
  const currentPost = usePostStore.getState().post;
  if (currentPost && currentPost._id === postId) {
    usePostStore.getState().updatePost(updates);
  }
};

// Helper to sync deletion
export const syncPostDeletion = postId => {
  // Delete from posts list
  usePostListStore.getState().deletePost(postId);

  // Clear single post if it's the same post
  const currentPost = usePostStore.getState().post;
  if (currentPost && currentPost._id === postId) {
    usePostStore.getState().clearPost();
  }
};
