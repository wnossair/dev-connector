import express from "express";
import passport from "passport";
import { validationResult } from "express-validator";
import {
  profileValidation,
  experienceValidation,
  educationValidation,
} from "../../middleware/validation.js";
import { sendSuccess, sendError, handleValidationErrors } from "../../utils/responseHandler.js";

import Profile from "../../models/Profile.js";
import User from "../../models/User.js"; // Required for .populate and potential direct User queries
import Post from "../../models/Post.js"; // Required for deleting user's posts

const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req, res) => sendSuccess(res, 200, "Profile Works"));

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      return sendError(res, 404, "There is no profile for this user");
    }
    sendSuccess(res, 200, "Profile fetched successfully", { profile });
  } catch (err) {
    next(err);
  }
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleValidationErrors(res, errors);
    }

    try {
      const {
        handle,
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
      } = req.body;

      const profileFields = {
        user: req.user.id,
        handle,
        company,
        website,
        location,
        status,
        bio,
        githubusername,
      };
      if (skills) {
        profileFields.skills = Array.isArray(skills)
          ? skills
          : skills.split(",").map(skill => skill.trim());
      }
      profileFields.social = { youtube, twitter, facebook, linkedin, instagram };

      let profile = await Profile.findOne({ user: req.user.id });
      let messageAction = "created";

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        messageAction = "updated";
      } else {
        const existingProfileByHandle = await Profile.findOne({ handle });
        if (existingProfileByHandle) {
          return sendError(res, 400, "That handle already exists", {
            errors: [{ msg: "That handle already exists", path: "handle" }],
          });
        }
        profile = new Profile(profileFields);
        await profile.save();
      }
      sendSuccess(
        res,
        messageAction === "created" ? 201 : 200,
        `Profile ${messageAction} successfully`,
        { profile }
      );
    } catch (err) {
      next(err);
    }
  }
);

// @route   GET api/profile/handle/:handle
// @desc    Get user profile by handle
// @access  Public
router.get("/handle/:handle", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ handle: req.params.handle }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      return sendError(res, 404, "Profile not found");
    }
    sendSuccess(res, 200, "Profile fetched successfully", { profile });
  } catch (err) {
    next(err);
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get user profile by user_id
// @access  Public
router.get("/user/:user_id", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", [
      "name",
      "avatar",
    ]);
    if (!profile) {
      return sendError(res, 404, "Profile not found");
    }
    sendSuccess(res, 200, "Profile fetched successfully", { profile });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return sendError(res, 404, "Profile not found (invalid ID format)");
    }
    next(err);
  }
});

// @route   GET api/profile/all
// @desc    Get all user profiles
// @access  Public
router.get("/all", async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    sendSuccess(res, 200, "All profiles fetched successfully", { profiles });
  } catch (err) {
    next(err);
  }
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  experienceValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleValidationErrors(res, errors);
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return sendError(res, 404, "Profile not found for this user");
      }

      const newExp = { ...req.body };
      profile.experience.unshift(newExp);
      await profile.save();
      sendSuccess(res, 201, "Experience added successfully", { profile });
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  educationValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleValidationErrors(res, errors);
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return sendError(res, 404, "Profile not found for this user");
      }

      const newEdu = { ...req.body };
      profile.education.unshift(newEdu);
      await profile.save();
      sendSuccess(res, 201, "Education added successfully", { profile });
    } catch (err) {
      next(err);
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience entry from profile
// @access  Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return sendError(res, 404, "Profile not found");
      }

      const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
      if (removeIndex === -1) {
        return sendError(res, 404, "Experience not found");
      }

      profile.experience.splice(removeIndex, 1);
      await profile.save();
      sendSuccess(res, 200, "Experience deleted successfully", { profile });
    } catch (err) {
      next(err);
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education entry from profile
// @access  Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return sendError(res, 404, "Profile not found");
      }

      const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
      if (removeIndex === -1) {
        return sendError(res, 404, "Education not found");
      }

      profile.education.splice(removeIndex, 1);
      await profile.save();
      sendSuccess(res, 200, "Education deleted successfully", { profile });
    } catch (err) {
      next(err);
    }
  }
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete("/", passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndDelete({ user: req.user.id });
    await User.findOneAndDelete({ _id: req.user.id });
    sendSuccess(res, 200, "User, profile, and posts deleted successfully");
  } catch (err) {
    next(err);
  }
});

export default router;
