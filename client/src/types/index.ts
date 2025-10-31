/**
 * Central Export for All Type Definitions
 *
 * Import types from this file throughout the application:
 * import { User, Profile, Post, etc } from '@/types';
 */

// Auth Types
export type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  VerifyAuthOptions,
  AuthResponse,
  UserResponse,
} from "./auth.types";

// Profile Types
export type {
  Experience,
  Education,
  Social,
  ProfileUser,
  Profile,
  ProfileState,
  CreateProfileData,
  AddExperienceData,
  AddEducationData,
  ProfileResponse,
  ProfilesResponse,
  GithubRepo,
} from "./profile.types";

// Post Types
export type {
  Comment,
  Like,
  Post,
  PostState,
  CreatePostData,
  CreateCommentData,
  PostResponse,
  PostsResponse,
} from "./post.types";

// API Types
export type {
  ApiResponse,
  ValidationError,
  ErrorResponse,
  ApiError,
  AxiosRequestConfig,
} from "./api.types";

// Error Types
export type { ErrorState, AppError } from "./error.types";

// Common Types
export type {
  InputChangeHandler,
  SelectOption,
  FieldErrors,
  LoadingState,
  ID,
  DateType,
  PaginationParams,
  PaginatedResponse,
  SortOrder,
  SortParams,
  RouteParams,
} from "./common.types";
