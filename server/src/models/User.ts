import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../types/models.js";

/**
 * User Schema Definition
 */
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

/**
 * User Model
 */
export const User: Model<IUser> = mongoose.model<IUser>("users", UserSchema);
