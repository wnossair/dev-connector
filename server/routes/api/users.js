import express from "express";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { validationResult } from "express-validator";
import { registerValidation, loginValidation } from "../../middleware/validation.js";
import { sendSuccess, sendError, handleValidationErrors } from "../../utils/responseHandler.js";

import User from "../../models/User.js";
import keys from "../../config/keys.js";

const router = express.Router();

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => sendSuccess(res, 200, "Users Works"));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", registerValidation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleValidationErrors(res, errors);
  }

  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return sendError(res, 400, "Email already exists", { email: "Email already exists" });
    }

    const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    user = new User({ name, email, avatar, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // For registration, typically you might want to return the created user object (excluding password)
    // or a subset of its fields. Or simply a success message.
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      date: user.date,
    };
    sendSuccess(res, 201, "User registered successfully", { user: userResponse });
  } catch (err) {
    next(err); // Pass errors to the global error handler
  }
});

// @route   POST api/users/login
// @desc    Login user / returning JWT Token
// @access  Public
router.post("/login", loginValidation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleValidationErrors(res, errors);
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 400, "Invalid credentials", { email: "Email does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 400, "Invalid credentials", { password: "Password is incorrect" });
    }

    const payload = { id: user.id, name: user.name, avatar: user.avatar };
    jwt.sign(payload, keys.secretOrKey, { expiresIn: "1h" }, (err, token) => {
      // Changed expiresIn to 1h as 60m is less clear
      if (err) throw err; // This will be caught by the outer try-catch and passed to next(err)
      sendSuccess(res, 200, "Login successful", { token: "Bearer " + token });
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  const currentUser = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
  };
  sendSuccess(res, 200, "Current user fetched successfully", { user: currentUser });
});

export default router;
