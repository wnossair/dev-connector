import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AxiosError } from "axios";
import { api } from "../utils/api";
import { useErrorStore } from "./useErrorStore";
import { useAuthStore } from "./useAuthStore";
import {
  Profile,
  CreateProfileData,
  AddExperienceData,
  AddEducationData,
  ApiResponse,
  ProfileResponse,
  ProfilesResponse,
  GithubRepo,
} from "../types";

interface ProfileStore {
  current: Profile | null;
  loading: boolean;
  all: Profile[];
  repos: GithubRepo[];

  // Sync actions
  setLoading: (loading: boolean) => void;
  setCurrent: (profile: Profile | null) => void;
  setAll: (profiles: Profile[]) => void;
  setRepos: (repos: GithubRepo[]) => void;
  clearProfile: () => void;

  // Async actions
  loadProfileById: (userId: string) => Promise<Profile | null>;
  loadCurrentProfile: () => Promise<Profile | Record<string, never>>;
  loadAllProfiles: () => Promise<void>;
  createProfile: (data: CreateProfileData) => Promise<Profile>;
  addExperience: (data: AddExperienceData) => Promise<Profile>;
  addEducation: (data: AddEducationData) => Promise<Profile>;
  deleteExperience: (id: string) => Promise<Profile>;
  deleteEducation: (id: string) => Promise<Profile>;
  deleteAccount: () => Promise<void>;
  loadGithubRepos: (username: string) => Promise<void>;
}

const handleError = (error: unknown, message: string): never => {
  const errorStore = useErrorStore.getState();
  const err = error as {
    response?: { data?: { errors?: Record<string, string>; message?: string } };
  };

  if (err.response?.data?.errors) {
    errorStore.setError(err.response.data.errors as Record<string, string>);
  } else if (err.response?.data?.message) {
    errorStore.setError({ message: err.response.data.message });
  } else {
    errorStore.setError({ message });
  }

  throw error;
};

export const useProfileStore = create<ProfileStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      current: null,
      loading: false,
      all: [],
      repos: [],

      // Sync Actions
      setLoading: loading => set({ loading }, false, "profile/setLoading"),

      setCurrent: profile => set({ current: profile }, false, "profile/setCurrent"),

      setAll: profiles => set({ all: profiles }, false, "profile/setAll"),

      setRepos: repos => set({ repos }, false, "profile/setRepos"),

      clearProfile: () =>
        set({ current: null, all: [], loading: false }, false, "profile/clearProfile"),

      // Async Actions
      loadProfileById: async (userId: string) => {
        set({ loading: true }, false, "profile/loadProfileById/pending");
        try {
          const response = await api.get<ApiResponse<ProfileResponse>>(`/profile/user/${userId}`);
          const profile = response.data.data.profile;

          set(
            { current: profile, repos: [], loading: false },
            false,
            "profile/loadProfileById/fulfilled",
          );

          return profile;
        } catch (error: unknown) {
          const axiosError = error as AxiosError;

          if (axiosError.response?.status === 404) {
            const errorStore = useErrorStore.getState();
            errorStore.setError({ message: `Profile for user ${userId} not found` });
            set({ loading: false }, false, "profile/loadProfileById/rejected");
            return null;
          }

          set({ loading: false }, false, "profile/loadProfileById/rejected");
          handleError(error, `Failed to load profile for user ${userId}`);
        }
      },

      loadCurrentProfile: async () => {
        set({ loading: true }, false, "profile/loadCurrent/pending");
        try {
          const res = await api.get<ApiResponse<ProfileResponse>>("/profile/me");
          const profile = res.data.data.profile;

          set(
            {
              current: profile, // If null, ok - user hasn't created a profile yet
              loading: false,
            },
            false,
            "profile/loadCurrent/fulfilled",
          );

          return res.data.data;
        } catch (error: unknown) {
          set({ loading: false }, false, "profile/loadCurrent/rejected");
          handleError(error, "Failed to load current profile");
        }
      },

      loadAllProfiles: async () => {
        set({ loading: true }, false, "profile/loadAllProfiles/pending");
        try {
          const response = await api.get<ApiResponse<ProfilesResponse>>("/profile/all");
          const profiles = response.data.data.profiles;

          set({ all: profiles, loading: false }, false, "profile/loadAllProfiles/fulfilled");
        } catch (error: unknown) {
          set({ loading: false }, false, "profile/loadAllProfiles/rejected");
          handleError(error, "Failed to load all profiles");
        }
      },

      createProfile: async (profileData: CreateProfileData) => {
        set({ loading: true }, false, "profile/createProfile/pending");
        try {
          const response = await api.post<ApiResponse<ProfileResponse>>("/profile", profileData);
          const profile = response.data.data.profile;

          set({ current: profile, loading: false }, false, "profile/createProfile/fulfilled");

          return profile;
        } catch (error: unknown) {
          set({ loading: false }, false, "profile/createProfile/rejected");
          handleError(error, "Failed to create/update profile");
        }
      },

      addExperience: async (experienceData: AddExperienceData) => {
        set({ loading: true }, false, "profile/addExperience/pending");
        try {
          const response = await api.post<ApiResponse<ProfileResponse>>(
            "/profile/experience",
            experienceData,
          );
          const profile = response.data.data.profile;

          set({ current: profile, loading: false }, false, "profile/addExperience/fulfilled");

          return profile;
        } catch (error: unknown) {
          set({ loading: false }, false, "profile/addExperience/rejected");
          handleError(error, "Failed to add experience");
        }
      },

      addEducation: async (educationData: AddEducationData) => {
        set({ loading: true }, false, "profile/addEducation/pending");
        try {
          const response = await api.post<ApiResponse<ProfileResponse>>(
            "/profile/education",
            educationData,
          );
          const profile = response.data.data.profile;

          set({ current: profile, loading: false }, false, "profile/addEducation/fulfilled");

          return profile;
        } catch (error: unknown) {
          set({ loading: false }, false, "profile/addEducation/rejected");
          handleError(error, "Failed to add education");
        }
      },

      deleteExperience: async (id: string) => {
        set({ loading: true }, false, "profile/deleteExperience/pending");
        try {
          const response = await api.delete<ApiResponse<ProfileResponse>>(
            `/profile/experience/${id}`,
          );
          const profile = response.data.data.profile;

          set({ current: profile, loading: false }, false, "profile/deleteExperience/fulfilled");

          return profile;
        } catch (error: unknown) {
          set({ loading: false }, false, "profile/deleteExperience/rejected");
          handleError(error, "Failed to delete experience");
        }
      },

      deleteEducation: async (id: string) => {
        set({ loading: true }, false, "profile/deleteEducation/pending");
        try {
          const response = await api.delete<ApiResponse<ProfileResponse>>(
            `/profile/education/${id}`,
          );
          const profile = response.data.data.profile;

          set({ current: profile, loading: false }, false, "profile/deleteEducation/fulfilled");

          return profile;
        } catch (error: unknown) {
          set({ loading: false }, false, "profile/deleteEducation/rejected");
          handleError(error, "Failed to delete education");
        }
      },

      deleteAccount: async () => {
        set({ loading: true }, false, "profile/deleteAccount/pending");
        try {
          await api.delete("/profile");

          // Clear profile state
          get().clearProfile();

          // Logout user
          const authStore = useAuthStore.getState();
          authStore.logout();

          set({ loading: false }, false, "profile/deleteAccount/fulfilled");
        } catch (error: unknown) {
          set({ loading: false }, false, "profile/deleteAccount/rejected");
          handleError(error, "Failed to delete account");
        }
      },

      loadGithubRepos: async (username: string) => {
        set({ loading: true }, false, "profile/loadGithubRepos/pending");
        try {
          const response = await api.get<ApiResponse<{ repos: GithubRepo[] }>>(
            `/profile/github/${username}`,
          );
          const repos = response.data.data.repos;

          set({ repos, loading: false }, false, "profile/loadGithubRepos/fulfilled");
        } catch (error: unknown) {
          set({ repos: [], loading: false }, false, "profile/loadGithubRepos/rejected");
          handleError(error, "Failed to load Github repos");
        }
      },
    }),
    {
      name: "Profile",
      store: "profile",
    },
  ),
);
