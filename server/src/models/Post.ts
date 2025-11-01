import mongoose, { Model, Schema } from "mongoose";
import { IPost, IComment, ILike } from "../types/models.js";

/**
 * Post Schema Definition
 */
const PostSchema = new Schema<IPost>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      // Disable automatic _id for like objects for $addToSet to work
      _id: false,
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Post Model
 */
export const Post: Model<IPost> = mongoose.model<IPost>("post", PostSchema);
