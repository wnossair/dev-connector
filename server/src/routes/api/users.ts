import express, { Request, Response } from "express";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { registerValidation, loginValidation } from "../../middleware/validation.js";
import { sendSuccess } from "../../utils/responseHandler.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { DuplicateError, AuthenticationError, InternalServerError } from "../../errors/AppError.js";
import { User } from "../../models/User.js";
import keys from "../../config/keys.js";
import { IRegisterRequest, ILoginRequest, IJwtPayload, IUserResponse } from "../../types/index.js";

const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req: Request, res: Response) => {
  sendSuccess(res, 200, "Users Works");
});

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  registerValidation,
  validateRequest,
  asyncHandler(async (req: Request<{}, {}, IRegisterRequest>, res: Response) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new DuplicateError("Email");
    }

    // Create new user
    const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    const user = new User({ name, email, avatar, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Return created user (excluding password)
    const userResponse: IUserResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      date: user.date,
    };

    sendSuccess(res, 201, "User registered successfully", { user: userResponse });
  })
);

// @route   POST api/users/login
// @desc    Login user / returning JWT Token
// @access  Public
router.post(
  "/login",
  loginValidation,
  validateRequest,
  asyncHandler(async (req: Request<{}, {}, ILoginRequest>, res: Response) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Generate JWT token
    const payload: IJwtPayload = { id: user.id, name: user.name, avatar: user.avatar };

    return new Promise<void>((resolve, reject) => {
      jwt.sign(payload, keys.secretOrKey, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          return reject(new InternalServerError("Failed to generate token"));
        }

        sendSuccess(res, 200, "Login successful", { token: "Bearer " + token });
        resolve();
      });
    });
  })
);

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const currentUser: IUserResponse = {
      _id: req.user!._id.toString(),
      name: req.user!.name,
      email: req.user!.email,
      avatar: req.user!.avatar,
      date: req.user!.date,
    };

    sendSuccess(res, 200, "Current user fetched successfully", { user: currentUser });
  })
);

export default router;
