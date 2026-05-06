/**
 * Environment Variable Type Definitions
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT?: string;
    MONGO_URI: string;
    JWT_SECRET: string;
    GITHUB_TOKEN?: string;
    CORS_ORIGIN?: string;
  }
}
