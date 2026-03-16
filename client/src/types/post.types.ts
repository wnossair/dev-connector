/**
 * Post Related Types
 */

export interface Comment {
  _id: string;
  user: string;
  text: string;
  name: string;
  avatar: string;
  date: string;
}

export interface Like {
  user: string;
}

export interface PopulatedPostUser {
  _id: string;
  name?: string;
  avatar?: string;
}

export interface Post {
  _id: string;
  user: string | PopulatedPostUser;
  text: string;
  name: string;
  avatar: string;
  likes: Like[];
  comments: Comment[];
  date: string;
}

export interface PostState {
  posts: Post[];
  post: Post | null;
  loading: boolean;
  error: string | null;
}

export interface CreatePostData {
  text: string;
}

export interface CreateCommentData {
  text: string;
}

export interface PostResponse {
  post: Post;
}

export interface PostsResponse {
  posts: Post[];
}
