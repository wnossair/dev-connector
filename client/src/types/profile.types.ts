/**
 * Profile Related Types
 */

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  from: string | Date;
  to?: string | Date;
  current: boolean;
  description?: string;
}

export interface Education {
  _id?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: string | Date;
  to?: string | Date;
  current: boolean;
  description?: string;
}

export interface Social {
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export interface ProfileUser {
  _id: string;
  name: string;
  avatar: string;
}

export interface Profile {
  _id: string;
  user: ProfileUser | string; // Can be populated or just ID
  handle: string;
  company?: string;
  website?: string;
  location?: string;
  role: string;
  skills: string[];
  bio?: string;
  githubusername?: string;
  experience: Experience[];
  education: Education[];
  social?: Social;
  date: string;
}

export interface ProfileState {
  profile: Profile | null;
  profiles: Profile[];
  loading: boolean;
  error: string | null;
}

export interface CreateProfileData {
  handle: string;
  company?: string;
  website?: string;
  location?: string;
  role: string;
  skills: string;
  bio?: string;
  githubusername?: string;
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export interface AddExperienceData {
  title: string;
  company: string;
  location?: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

export interface AddEducationData {
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: string;
  to?: string;
  current: boolean;
  description?: string;
}

export interface ProfileResponse {
  profile: Profile;
}

export interface ProfilesResponse {
  profiles: Profile[];
}

export interface GithubRepo {
  id: string;
  name: string;
  html_url: string;
  description?: string;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
}
