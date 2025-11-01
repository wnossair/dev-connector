/**
 * Mongoose Model Type Definitions
 */

import { Document, Types } from "mongoose";

/**
 * User Model Types
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  date: Date;
}

/**
 * Profile Model Types
 */
export interface IExperience {
  _id?: Types.ObjectId;
  title: string;
  company: string;
  location?: string;
  from: Date;
  to?: Date;
  current: boolean;
  description?: string;
}

export interface IEducation {
  _id?: Types.ObjectId;
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: Date;
  to?: Date;
  current: boolean;
  description?: string;
}

export interface ISocial {
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export interface IProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  handle: string;
  company?: string;
  website?: string;
  location?: string;
  role: string;
  skills: string[];
  bio?: string;
  githubusername?: string;
  experience: IExperience[];
  education: IEducation[];
  social?: ISocial;
  date: Date;
}

/**
 * Post Model Types
 */
export interface ILike {
  user: Types.ObjectId;
}

export interface IComment {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  name?: string;
  avatar?: string;
  date: Date;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;
  text: string;
  name?: string;
  avatar?: string;
  likes: ILike[];
  comments: IComment[];
  date: Date;
}
