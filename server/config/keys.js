import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const keys = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.JWT_SECRET, // Used for JWT
  port: process.env.PORT || 5000, // Default to 5000 if not specified in .env
};

export default keys;
