import express, { Request, Response } from "express";
import passport from "passport";
import axios from "axios";
import {
  profileValidation,
  experienceValidation,
  educationValidation,
} from "../../middleware/validation.js";
import { sendSuccess } from "../../utils/responseHandler.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { NotFoundError, DuplicateError, ExternalServiceError } from "../../errors/AppError.js";
import keys from "../../config/keys.js";
import { Profile } from "../../models/Profile.js";
import { User } from "../../models/User.js";
import { Post } from "../../models/Post.js";
import {
  ICreateProfileRequest,
  IAddExperienceRequest,
  IAddEducationRequest,
} from "../../types/index.js";

const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (req: Request, res: Response) => {
  sendSuccess(res, 200, "Profile Works");
});

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await Profile.findOne({ user: req.user!.id }).populate("user", [
      "name",
      "avatar",
    ]);

    if (!profile) {
      return sendSuccess(res, 200, "No profile found for this user", { profile: null });
    }

    sendSuccess(res, 200, "Profile fetched successfully", { profile });
  })
);

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileValidation,
  validateRequest,
  asyncHandler(async (req: Request<{}, {}, ICreateProfileRequest>, res: Response) => {
    const {
      handle,
      company,
      website,
      location,
      role,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    const profileFields: any = {
      user: req.user!.id,
      handle,
      company,
      website,
      location,
      role,
      bio,
      githubusername,
    };

    if (skills) {
      profileFields.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill: string) => skill.trim());
    }

    profileFields.social = { youtube, twitter, facebook, linkedin, instagram };

    let profile = await Profile.findOne({ user: req.user!.id });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user!.id },
        { $set: profileFields },
        { new: true }
      ).populate("user", ["name", "avatar"]);

      return sendSuccess(res, 200, "Profile updated successfully", { profile });
    }

    // Check if handle already exists
    const existingProfileByHandle = await Profile.findOne({ handle });
    if (existingProfileByHandle) {
      throw new DuplicateError("Handle");
    }

    // Create new profile
    profile = new Profile(profileFields);
    await profile.save();

    profile = await Profile.populate(profile, { path: "user", select: "name avatar" });

    sendSuccess(res, 201, "Profile created successfully", { profile });
  })
);

// @route   GET api/profile/user/:user_id
// @desc    Get user profile by user_id
// @access  Public
router.get(
  "/user/:user_id",
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", [
      "name",
      "avatar",
    ]);

    if (!profile) {
      throw new NotFoundError("Profile");
    }

    sendSuccess(res, 200, "Profile fetched successfully", { profile });
  })
);

// @route   GET api/profile/all
// @desc    Get all user profiles
// @access  Public
router.get(
  "/all",
  asyncHandler(async (req: Request, res: Response) => {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    if (!profiles || profiles.length === 0) {
      throw new NotFoundError("Profiles");
    }

    sendSuccess(res, 200, "Profiles fetched successfully", { profiles });
  })
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  experienceValidation,
  validateRequest,
  asyncHandler(async (req: Request<{}, {}, IAddExperienceRequest>, res: Response) => {
    const profile = await Profile.findOne({ user: req.user!.id });

    if (!profile) {
      throw new NotFoundError("Profile");
    }

    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: new Date(req.body.from),
      to: req.body.to ? new Date(req.body.to) : undefined,
      current: req.body.current,
      description: req.body.description,
    } as any;

    profile.experience.unshift(newExp);
    await profile.save();

    const updatedProfile = await Profile.findOne({ user: req.user!.id }).populate("user", [
      "name",
      "avatar",
    ]);

    sendSuccess(res, 200, "Experience added successfully", { profile: updatedProfile });
  })
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  educationValidation,
  validateRequest,
  asyncHandler(async (req: Request<{}, {}, IAddEducationRequest>, res: Response) => {
    const profile = await Profile.findOne({ user: req.user!.id });

    if (!profile) {
      throw new NotFoundError("Profile");
    }

    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldOfStudy,
      from: new Date(req.body.from),
      to: req.body.to ? new Date(req.body.to) : undefined,
      current: req.body.current,
      description: req.body.description,
    } as any;

    profile.education.unshift(newEdu);
    await profile.save();

    const updatedProfile = await Profile.findOne({ user: req.user!.id }).populate("user", [
      "name",
      "avatar",
    ]);

    sendSuccess(res, 200, "Education added successfully", { profile: updatedProfile });
  })
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience entry from profile
// @access  Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await Profile.findOne({ user: req.user!.id });

    if (!profile) {
      throw new NotFoundError("Profile");
    }

    const removeIndex = profile.experience
      .map((item: any) => item._id?.toString())
      .indexOf(req.params.exp_id);

    if (removeIndex === -1) {
      throw new NotFoundError("Experience");
    }

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    const updatedProfile = await Profile.findOne({ user: req.user!.id }).populate("user", [
      "name",
      "avatar",
    ]);

    sendSuccess(res, 200, "Experience deleted successfully", { profile: updatedProfile });
  })
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education entry from profile
// @access  Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await Profile.findOne({ user: req.user!.id });

    if (!profile) {
      throw new NotFoundError("Profile");
    }

    const removeIndex = profile.education
      .map((item: any) => item._id?.toString())
      .indexOf(req.params.edu_id);

    if (removeIndex === -1) {
      throw new NotFoundError("Education");
    }

    profile.education.splice(removeIndex, 1);
    await profile.save();

    const updatedProfile = await Profile.findOne({ user: req.user!.id }).populate("user", [
      "name",
      "avatar",
    ]);

    sendSuccess(res, 200, "Education deleted successfully", { profile: updatedProfile });
  })
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    // Remove user posts
    await Post.deleteMany({ user: req.user!.id });
    // Remove profile
    await Profile.findOneAndDelete({ user: req.user!.id });
    // Remove user
    await User.findOneAndDelete({ _id: req.user!.id });

    sendSuccess(res, 200, "User and profile deleted successfully");
  })
);

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get(
  "/github/:username",
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`,
        {
          headers: {
            Authorization: `token ${keys.githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      const repos = response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
      }));

      sendSuccess(res, 200, "GitHub repos fetched successfully", { repos });
    } catch (err: any) {
      if (err.response?.status === 404) {
        throw new NotFoundError("GitHub user");
      }
      throw new ExternalServiceError("GitHub", err.response?.status || 502);
    }
  })
);

export default router;
