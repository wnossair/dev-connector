import express, { Application, Request, Response } from "express";
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
import { RateLimitError } from "./errors/AppError.js";
import logger from "./utils/logger.js";

const app: Application = express();

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
  .then(() => logger.info("MongoDB connected"))
  .catch(err => {
    logger.fatal({ err }, "MongoDB connection failed");
    process.exit(1);
  });

// Passport middleware
app.use(passport.initialize());
// Passport Config
passportConfig(passport);

// Test the app is running
app.get("/", (req: Request, res: Response) => res.send("API is running..."));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // Higher limit for development
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => {
    // Skip rate limiting for localhost in development
    return (
      process.env.NODE_ENV !== "production" &&
      (req.ip === "127.0.0.1" || req.ip === "::1" || req.ip === "::ffff:127.0.0.1")
    );
  },
  handler: (req, res, next, options) => {
    // Throw RateLimitError which will be caught by asyncHandler
    throw new RateLimitError(
      `Too many requests from this IP. Please try again after ${options.windowMs / 60000} minutes.`,
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
app.listen(port, () => logger.info({ port }, "Server started"));
