/**
 * Authentication Related Types
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  date: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password2: string;
}

export interface VerifyAuthOptions {
  forceRefresh?: boolean;
}

export interface AuthResponse {
  token: string;
}

export interface UserResponse {
  user: User;
}
