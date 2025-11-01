/**
 * Authentication and Request/Response Type Definitions
 */

import { Types } from "mongoose";

/**
 * JWT Payload
 */
export interface IJwtPayload {
  id: string;
  name: string;
  avatar?: string;
  iat?: number;
  exp?: number;
}

/**
 * Request Body Types
 */
export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  password2?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

/**
 * Response Types
 */
export interface IAuthResponse {
  success: boolean;
  token: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    date: Date;
  };
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  date: Date;
}

/**
 * Profile Request Types
 */
export interface ICreateProfileRequest {
  handle: string;
  role: string;
  skills: string | string[];
  company?: string;
  website?: string;
  location?: string;
  bio?: string;
  githubusername?: string;
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export interface IAddExperienceRequest {
  title: string;
  company: string;
  location?: string;
  from: string | Date;
  to?: string | Date;
  current: boolean;
  description?: string;
}

export interface IAddEducationRequest {
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: string | Date;
  to?: string | Date;
  current: boolean;
  description?: string;
}

/**
 * Post Request Types
 */
export interface ICreatePostRequest {
  text: string;
  name?: string;
  avatar?: string;
}

export interface ICreateCommentRequest {
  text: string;
  name?: string;
  avatar?: string;
}

/**
 * API Response Wrapper
 */
export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, any>;
}

/**
 * Validation Error
 */
export interface IValidationError {
  field: string;
  message: string;
}
