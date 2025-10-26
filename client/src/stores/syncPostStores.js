import { usePostsStore } from "./usePostsStore";
import { useCurrentPostStore } from "./useCurrentPostStore";

// Helper to sync updates between list and current post
export const syncPostUpdates = (postId, updates) => {
  // Update in posts list
  usePostsStore.getState().updatePost(postId, updates);

  // Update in current post if it's the same post
  const currentPost = useCurrentPostStore.getState().current;
  if (currentPost && currentPost._id === postId) {
    useCurrentPostStore.getState().updateCurrentPost(updates);
  }
};

// Helper to sync deletion
export const syncPostDeletion = postId => {
  // Delete from posts list
  usePostsStore.getState().deletePost(postId);

  // Clear current post if it's the same post
  const currentPost = useCurrentPostStore.getState().current;
  if (currentPost && currentPost._id === postId) {
    useCurrentPostStore.getState().clearCurrentPost();
  }
};
