import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";

import keys from "../config/keys.js";
import { AuthenticationError, DuplicateError, InternalServerError } from "../errors/AppError.js";
import { User } from "../models/User.js";
import { ILoginRequest, IRegisterRequest, IJwtPayload, IUserResponse } from "../types/index.js";
import type { IUser } from "../types/models.js";

type MongoDuplicateError = {
  code?: number;
  keyPattern?: Record<string, unknown>;
};

const toUserResponse = (user: IUser): IUserResponse => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  date: user.date,
});

const isDuplicateKeyError = (error: unknown): error is MongoDuplicateError => {
  return (
    typeof error === "object" && error !== null && (error as MongoDuplicateError).code === 11000
  );
};

export const registerUser = async (payload: IRegisterRequest): Promise<IUserResponse> => {
  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();
  const password = payload.password;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new DuplicateError("Email");
  }

  const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
  const user = new User({ name, email, avatar, password });

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new DuplicateError("Email");
    }
    throw error;
  }

  return toUserResponse(user);
};

export const loginUser = async (payload: ILoginRequest): Promise<string> => {
  const email = payload.email.trim().toLowerCase();
  const user = await User.findOne({ email });

  if (!user) {
    throw new AuthenticationError("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    throw new AuthenticationError("Invalid credentials");
  }

  const jwtPayload: IJwtPayload = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
  };

  return new Promise<string>((resolve, reject) => {
    jwt.sign(jwtPayload, keys.secretOrKey, { expiresIn: "1h" }, (error, token) => {
      if (error || !token) {
        reject(new InternalServerError("Failed to generate token"));
        return;
      }

      resolve(`Bearer ${token}`);
    });
  });
};

export const getCurrentUserResponse = (user: IUser): IUserResponse => {
  return toUserResponse(user);
};
