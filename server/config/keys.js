import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("FATAL ERROR: MONGO_URI is not defined.");
}
if (!process.env.JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
}

const keys = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.JWT_SECRET, // Used for JWT
  port: process.env.PORT || 5000, // Default to 5000 if not specified in .env
  githubToken: process.env.GITHUB_TOKEN,
};
// It's good practice to freeze the keys object to prevent accidental modifications
Object.freeze(keys);

export default keys;
