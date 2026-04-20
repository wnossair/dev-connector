import axios from "axios";
import mongoose from "mongoose";

import keys from "../config/keys.js";
import {
  DuplicateError,
  ExternalServiceError,
  InternalServerError,
  NotFoundError,
} from "../errors/AppError.js";
import { Post } from "../models/Post.js";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import {
  IAddEducationRequest,
  IAddExperienceRequest,
  ICreateProfileRequest,
} from "../types/index.js";
import type { IEducation, IExperience, IProfile } from "../types/models.js";

export type GithubRepoSummary = {
  id: string;
  name: string;
  html_url: string;
  description: string;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
};

export type ProfileUpsertResult = {
  profile: IProfile;
  created: boolean;
};

const GITHUB_REPOS_CACHE_TTL_MS = 10 * 60 * 1000;
const githubReposCache = new Map<string, { expiresAt: number; repos: GithubRepoSummary[] }>();

const isDuplicateKeyError = (
  error: unknown,
): error is { code?: number; keyPattern?: Record<string, unknown> } => {
  return typeof error === "object" && error !== null && (error as { code?: number }).code === 11000;
};

const loadProfile = async (userId: string): Promise<IProfile | null> => {
  return Profile.findOne({ user: userId }).populate("user", ["name", "avatar"]);
};

const populateProfileUser = async (profile: IProfile): Promise<IProfile> => {
  return Profile.populate(profile, { path: "user", select: "name avatar" }) as Promise<IProfile>;
};

const normalizeSkills = (skills: string | string[] | undefined): string[] | undefined => {
  if (!skills) {
    return undefined;
  }

  return Array.isArray(skills) ? skills : skills.split(",").map(skill => skill.trim());
};

const buildProfileFields = (
  userId: string,
  payload: ICreateProfileRequest,
): Record<string, unknown> => {
  const fields: Record<string, unknown> = {
    user: userId,
    handle: payload.handle.trim(),
    company: payload.company?.trim(),
    website: payload.website?.trim(),
    location: payload.location?.trim(),
    role: payload.role,
    bio: payload.bio?.trim(),
    githubusername: payload.githubusername?.trim(),
  };

  const skills = normalizeSkills(payload.skills);
  if (skills) {
    fields.skills = skills;
  }

  fields.social = {
    youtube: payload.youtube?.trim(),
    twitter: payload.twitter?.trim(),
    facebook: payload.facebook?.trim(),
    linkedin: payload.linkedin?.trim(),
    instagram: payload.instagram?.trim(),
  };

  return fields;
};

const getCachedGithubRepos = (username: string): GithubRepoSummary[] | null => {
  const cacheKey = username.toLowerCase();
  const cached = githubReposCache.get(cacheKey);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    githubReposCache.delete(cacheKey);
    return null;
  }

  return cached.repos;
};

const setCachedGithubRepos = (username: string, repos: GithubRepoSummary[]): void => {
  githubReposCache.set(username.toLowerCase(), {
    expiresAt: Date.now() + GITHUB_REPOS_CACHE_TTL_MS,
    repos,
  });
};

const buildGithubHeaders = (useToken: boolean): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "devconnector-api",
  };

  if (useToken && keys.githubToken?.trim()) {
    headers.Authorization = `Bearer ${keys.githubToken.trim()}`;
  }

  return headers;
};

export const getCurrentProfile = async (userId: string): Promise<IProfile | null> => {
  return loadProfile(userId);
};

export const upsertProfile = async (
  userId: string,
  payload: ICreateProfileRequest,
): Promise<ProfileUpsertResult> => {
  const profileFields = buildProfileFields(userId, payload);

  const existingProfile = await Profile.findOne({ user: userId });
  if (existingProfile) {
    try {
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: profileFields },
        { new: true },
      ).populate("user", ["name", "avatar"]);

      if (!updatedProfile) {
        throw new InternalServerError("Failed to update profile");
      }

      return { profile: updatedProfile, created: false };
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        const duplicateField = Object.keys(error.keyPattern ?? {})[0];
        if (duplicateField === "handle") {
          throw new DuplicateError("Handle");
        }
        throw new DuplicateError("Profile");
      }

      throw error;
    }
  }

  const existingProfileByHandle = await Profile.findOne({ handle: profileFields.handle });
  if (existingProfileByHandle) {
    throw new DuplicateError("Handle");
  }

  try {
    const profile = new Profile(profileFields);
    await profile.save();
    return { profile: await populateProfileUser(profile), created: true };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      const duplicateField = Object.keys(error.keyPattern ?? {})[0];
      if (duplicateField === "handle") {
        throw new DuplicateError("Handle");
      }
      if (duplicateField === "user") {
        throw new DuplicateError("Profile");
      }
      throw new DuplicateError("Profile");
    }

    throw error;
  }
};

export const getProfileByUserId = async (userId: string): Promise<IProfile> => {
  const profile = await Profile.findOne({ user: userId }).populate("user", ["name", "avatar"]);

  if (!profile) {
    throw new NotFoundError("Profile");
  }

  return profile;
};

export const getAllProfiles = async (): Promise<IProfile[]> => {
  const profiles = await Profile.find().populate("user", ["name", "avatar"]);

  if (!profiles || profiles.length === 0) {
    throw new NotFoundError("Profiles");
  }

  return profiles;
};

export const addExperience = async (
  userId: string,
  payload: IAddExperienceRequest,
): Promise<IProfile> => {
  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new NotFoundError("Profile");
  }

  const newExperience: IExperience = {
    title: payload.title,
    company: payload.company,
    location: payload.location,
    from: new Date(payload.from),
    to: payload.to ? new Date(payload.to) : undefined,
    current: payload.current,
    description: payload.description,
  };

  profile.experience.unshift(newExperience);
  await profile.save();

  const updatedProfile = await loadProfile(userId);
  if (!updatedProfile) {
    throw new InternalServerError("Failed to update profile");
  }

  return updatedProfile;
};

export const addEducation = async (
  userId: string,
  payload: IAddEducationRequest,
): Promise<IProfile> => {
  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new NotFoundError("Profile");
  }

  const newEducation: IEducation = {
    school: payload.school,
    degree: payload.degree,
    fieldOfStudy: payload.fieldOfStudy,
    from: new Date(payload.from),
    to: payload.to ? new Date(payload.to) : undefined,
    current: payload.current,
    description: payload.description,
  };

  profile.education.unshift(newEducation);
  await profile.save();

  const updatedProfile = await loadProfile(userId);
  if (!updatedProfile) {
    throw new InternalServerError("Failed to update profile");
  }

  return updatedProfile;
};

export const deleteExperience = async (userId: string, experienceId: string): Promise<IProfile> => {
  if (!mongoose.Types.ObjectId.isValid(experienceId)) {
    throw new NotFoundError("Experience");
  }

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new NotFoundError("Profile");
  }

  const removeIndex = profile.experience.findIndex(item => item._id?.toString() === experienceId);
  if (removeIndex === -1) {
    throw new NotFoundError("Experience");
  }

  profile.experience.splice(removeIndex, 1);
  await profile.save();

  const updatedProfile = await loadProfile(userId);
  if (!updatedProfile) {
    throw new InternalServerError("Failed to update profile");
  }

  return updatedProfile;
};

export const deleteEducation = async (userId: string, educationId: string): Promise<IProfile> => {
  if (!mongoose.Types.ObjectId.isValid(educationId)) {
    throw new NotFoundError("Education");
  }

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new NotFoundError("Profile");
  }

  const removeIndex = profile.education.findIndex(item => item._id?.toString() === educationId);
  if (removeIndex === -1) {
    throw new NotFoundError("Education");
  }

  profile.education.splice(removeIndex, 1);
  await profile.save();

  const updatedProfile = await loadProfile(userId);
  if (!updatedProfile) {
    throw new InternalServerError("Failed to update profile");
  }

  return updatedProfile;
};

export const deleteAccount = async (userId: string): Promise<void> => {
  await Post.deleteMany({ user: userId });
  await Profile.findOneAndDelete({ user: userId });
  await User.findOneAndDelete({ _id: userId });
};

export const fetchGithubRepos = async (username: string): Promise<GithubRepoSummary[]> => {
  const cachedRepos = getCachedGithubRepos(username);
  if (cachedRepos) {
    return cachedRepos;
  }

  const githubUrl = `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`;
  const hasToken = Boolean(keys.githubToken?.trim());

  try {
    let response;

    try {
      response = await axios.get(githubUrl, {
        headers: buildGithubHeaders(hasToken),
      });
    } catch (error: any) {
      if (hasToken && error.response?.status === 401) {
        response = await axios.get(githubUrl, {
          headers: buildGithubHeaders(false),
        });
      } else {
        throw error;
      }
    }

    const repos: GithubRepoSummary[] = response.data.map((repo: any) => ({
      id: String(repo.id),
      name: repo.name,
      html_url: repo.html_url,
      description: repo.description ?? "",
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      watchers_count: repo.watchers_count,
      forks_count: repo.forks_count,
    }));

    setCachedGithubRepos(username, repos);
    return repos;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new NotFoundError("GitHub user");
    }

    if (error.response?.status === 403) {
      throw new ExternalServiceError(
        "GitHub",
        503,
        "GitHub rate limit reached. Please try again later",
      );
    }

    throw new ExternalServiceError("GitHub", 502);
  }
};
