import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "../utils/api";
import { extractErrorMessage, throwWithSharedError } from "../utils/error";
import {
  User,
  RegisterData,
  LoginCredentials,
  VerifyAuthOptions,
  AuthResponse,
  UserResponse,
  ApiResponse,
} from "../types";

interface AuthStore {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;

  // Sync actions
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (isAuth: boolean) => void;
  logout: () => void;

  // Async actions
  registerUser: (data: RegisterData) => Promise<UserResponse>;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  loadUser: () => Promise<UserResponse>;
  verifyAuth: (options?: VerifyAuthOptions) => Promise<{ isValid: boolean; error?: string }>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => {
      const clearAuthState = () => {
        localStorage.removeItem("token");
        if (api.defaults.headers.common) {
          delete api.defaults.headers.common["Authorization"];
        }
        set(
          {
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
          },
          false,
          "auth/clearAuthState",
        );
      };

      return {
        // Initial State
        token: localStorage.getItem("token"),
        isAuthenticated: false,
        loading: false,
        user: null,

        // Sync Actions
        setToken: token => {
          if (token) {
            localStorage.setItem("token", token);
            if (api.defaults.headers.common) {
              api.defaults.headers.common["Authorization"] = token;
            }
          } else {
            localStorage.removeItem("token");
            if (api.defaults.headers.common) {
              delete api.defaults.headers.common["Authorization"];
            }
          }
          set({ token }, false, "auth/setToken");
        },

        setUser: user => set({ user }, false, "auth/setUser"),

        setLoading: loading => set({ loading }, false, "auth/setLoading"),

        setAuthenticated: isAuth =>
          set({ isAuthenticated: isAuth }, false, "auth/setAuthenticated"),

        logout: clearAuthState,

        // Async Actions
        registerUser: async (data: RegisterData) => {
          set({ loading: true }, false, "auth/register/pending");
          try {
            const res = await api.post<ApiResponse<UserResponse>>("/users/register", data);
            set({ loading: false }, false, "auth/register/fulfilled");
            return res.data.data;
          } catch (error: unknown) {
            set({ loading: false }, false, "auth/register/rejected");
            throwWithSharedError(error, "Registration failed");
          }
        },

        loginUser: async (credentials: LoginCredentials) => {
          set({ loading: true }, false, "auth/login/pending");
          try {
            const res = await api.post<ApiResponse<AuthResponse>>("/users/login", credentials);
            const { token } = res.data.data;

            // Set token first
            get().setToken(token);
            set({ isAuthenticated: true }, false, "auth/login/token-set");

            // Load user data
            await get().loadUser();

            set({ loading: false }, false, "auth/login/fulfilled");
          } catch (error: unknown) {
            clearAuthState();
            throwWithSharedError(error, "Login failed");
          }
        },

        loadUser: async () => {
          set({ loading: true }, false, "auth/loadUser/pending");
          try {
            const res = await api.get<ApiResponse<UserResponse>>("/users/current");
            const userData = res.data.data;

            set(
              {
                user: userData.user,
                isAuthenticated: true,
                loading: false,
              },
              false,
              "auth/loadUser/fulfilled",
            );

            return userData;
          } catch (error: unknown) {
            get().logout();
            set({ loading: false }, false, "auth/loadUser/rejected");
            throwWithSharedError(error, "Failed to load user session");
          }
        },

        verifyAuth: async (options?: VerifyAuthOptions) => {
          const { forceRefresh = false } = options || {};
          const state = get();

          // If already authenticated and not forcing refresh, return valid
          if (!forceRefresh && state.user && state.isAuthenticated) {
            return { isValid: true };
          }

          const token = localStorage.getItem("token");
          if (!token) {
            return { isValid: false };
          }

          if (api.defaults.headers.common) {
            api.defaults.headers.common["Authorization"] = token;
          }

          set({ loading: true }, false, "auth/verify/pending");

          try {
            const res = await api.get<ApiResponse<UserResponse>>("/users/current");

            if (res.data && res.data.success && res.data.data && res.data.data.user) {
              const currentState = get();
              if (!currentState.user || forceRefresh) {
                await get().loadUser();
              }
              set({ loading: false }, false, "auth/verify/fulfilled");
              return { isValid: true };
            }

            get().logout();
            set({ loading: false }, false, "auth/verify/fulfilled");
            return { isValid: false };
          } catch (error: unknown) {
            get().logout();
            set({ loading: false }, false, "auth/verify/rejected");

            const errorMessage = extractErrorMessage(error, "Auth verification failed");
            return {
              isValid: false,
              error: errorMessage,
            };
          }
        },
      };
    },
    {
      name: "Auth",
      store: "auth",
    },
  ),
);
