import express, { Request, Response } from "express";
import passport from "passport";

import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  educationValidation,
  experienceValidation,
  profileValidation,
} from "../../middleware/validation.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import {
  IAddEducationRequest,
  IAddExperienceRequest,
  ICreateProfileRequest,
} from "../../types/index.js";
import {
  addEducation,
  addExperience,
  deleteAccount,
  deleteEducation,
  deleteExperience,
  fetchGithubRepos,
  getAllProfiles,
  getCurrentProfile,
  getProfileByUserId,
  upsertProfile,
} from "../../services/profileService.js";
import { sendSuccess } from "../../utils/responseHandler.js";

const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get("/test", (_req: Request, res: Response) => {
  sendSuccess(res, 200, "Profile Works");
});

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await getCurrentProfile(req.user!.id);

    if (!profile) {
      return sendSuccess(res, 200, "No profile found for this user", { profile: null });
    }

    sendSuccess(res, 200, "Profile fetched successfully", { profile });
  }),
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
    const result = await upsertProfile(req.user!.id, req.body);
    sendSuccess(
      res,
      result.created ? 201 : 200,
      result.created ? "Profile created successfully" : "Profile updated successfully",
      { profile: result.profile },
    );
  }),
);

// @route   GET api/profile/user/:user_id
// @desc    Get user profile by user_id
// @access  Public
router.get(
  "/user/:user_id",
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await getProfileByUserId(req.params.user_id);
    sendSuccess(res, 200, "Profile fetched successfully", { profile });
  }),
);

// @route   GET api/profile/all
// @desc    Get all user profiles
// @access  Public
router.get(
  "/all",
  asyncHandler(async (_req: Request, res: Response) => {
    const profiles = await getAllProfiles();
    sendSuccess(res, 200, "Profiles fetched successfully", { profiles });
  }),
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
    const profile = await addExperience(req.user!.id, req.body);
    sendSuccess(res, 200, "Experience added successfully", { profile });
  }),
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
    const profile = await addEducation(req.user!.id, req.body);
    sendSuccess(res, 200, "Education added successfully", { profile });
  }),
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience entry from profile
// @access  Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await deleteExperience(req.user!.id, req.params.exp_id);
    sendSuccess(res, 200, "Experience deleted successfully", { profile });
  }),
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education entry from profile
// @access  Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const profile = await deleteEducation(req.user!.id, req.params.edu_id);
    sendSuccess(res, 200, "Education deleted successfully", { profile });
  }),
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    await deleteAccount(req.user!.id);
    sendSuccess(res, 200, "User and profile deleted successfully");
  }),
);

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get(
  "/github/:username",
  asyncHandler(async (req: Request, res: Response) => {
    const repos = await fetchGithubRepos(req.params.username);
    sendSuccess(res, 200, "GitHub repos fetched successfully", { repos });
  }),
);

export default router;
