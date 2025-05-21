import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import routes
import usersRoutes from "./routes/api/users.js";
import profileRoutes from "./routes/api/profile.js";
import postsRoutes from "./routes/api/posts.js";

// Import config
import keys from "./config/keys.js";
import passportConfig from "./config/passport.js";

// Import utilities and middleware
import errorHandler from "./middleware/errorHandler.js";
import { sendError } from "./utils/responseHandler.js"; // For rate limiter

const app = express();

// Security Middleware
app.use(helmet());

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB Config
const db = keys.mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Passport middleware
app.use(passport.initialize());
// Passport Config
passportConfig(passport);

// Test the app is running
app.get("/", (req, res) => res.send("API is running..."));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    // Use sendError utility for rate limit response
    sendError(
      res,
      options.statusCode,
      "Too many requests from this IP, please try again after 15 minutes",
      "Rate limit exceeded"
    );
  },
});
app.use("/api/", apiLimiter);

// Use Routes
app.use("/api/users", usersRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postsRoutes);

// Use Global error handler (must be defined after all routes)
app.use(errorHandler);

const port = keys.port;
app.listen(port, () => console.log(`Server running on port ${port}`));
