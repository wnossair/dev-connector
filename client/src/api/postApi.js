import { api } from "../utils/api";

export const postApi = {
  getPosts: async () => {
    const response = await api.get("/posts");
    return response.data.data.posts;
  },

  getPost: async postId => {
    const response = await api.get(`/posts/${postId}`);
    return response.data.data.post;
  },

  createPost: async postData => {
    const response = await api.post("/posts", postData);
    return response.data.data.post;
  },

  deletePost: async postId => {
    await api.delete(`/posts/${postId}`);
    return postId;
  },

  likePost: async postId => {
    const response = await api.post(`/posts/like/${postId}`);
    return { postId, likes: response.data.data.likes };
  },

  unlikePost: async postId => {
    const response = await api.post(`/posts/unlike/${postId}`);
    return { postId, likes: response.data.data.likes };
  },

  addComment: async (postId, commentData) => {
    const response = await api.post(`/posts/comment/${postId}`, commentData);
    return { postId, comments: response.data.data.comments };
  },

  deleteComment: async (postId, commentId) => {
    const response = await api.delete(`/posts/comment/${postId}/${commentId}`);
    return { postId, comments: response.data.data.comments };
  },
};
