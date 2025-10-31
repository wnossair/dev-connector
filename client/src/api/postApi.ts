import { api } from "../utils/api";
import { Post, Comment, Like, CreatePostData, CreateCommentData, ApiResponse } from "../types";

interface PostsResponse {
  posts: Post[];
}

interface PostResponse {
  post: Post;
}

interface LikesResponse {
  likes: Like[];
}

interface CommentsResponse {
  comments: Comment[];
}

export const postApi = {
  getPosts: async (): Promise<Post[]> => {
    const response = await api.get<ApiResponse<PostsResponse>>("/posts");
    return response.data.data.posts;
  },

  getPost: async (postId: string): Promise<Post> => {
    const response = await api.get<ApiResponse<PostResponse>>(`/posts/${postId}`);
    return response.data.data.post;
  },

  createPost: async (postData: CreatePostData): Promise<Post> => {
    const response = await api.post<ApiResponse<PostResponse>>("/posts", postData);
    return response.data.data.post;
  },

  deletePost: async (postId: string): Promise<string> => {
    await api.delete(`/posts/${postId}`);
    return postId;
  },

  likePost: async (postId: string): Promise<{ postId: string; likes: Like[] }> => {
    const response = await api.post<ApiResponse<LikesResponse>>(`/posts/like/${postId}`);
    return { postId, likes: response.data.data.likes };
  },

  unlikePost: async (postId: string): Promise<{ postId: string; likes: Like[] }> => {
    const response = await api.post<ApiResponse<LikesResponse>>(`/posts/unlike/${postId}`);
    return { postId, likes: response.data.data.likes };
  },

  addComment: async (
    postId: string,
    commentData: CreateCommentData
  ): Promise<{ postId: string; comments: Comment[] }> => {
    const response = await api.post<ApiResponse<CommentsResponse>>(
      `/posts/comment/${postId}`,
      commentData
    );
    return { postId, comments: response.data.data.comments };
  },

  deleteComment: async (
    postId: string,
    commentId: string
  ): Promise<{ postId: string; comments: Comment[] }> => {
    const response = await api.delete<ApiResponse<CommentsResponse>>(
      `/posts/comment/${postId}/${commentId}`
    );
    return { postId, comments: response.data.data.comments };
  },
};
