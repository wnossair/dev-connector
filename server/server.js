import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import routes
import usersRoutes from "./routes/api/users.js";
import profileRoutes from "./routes/api/profile.js";
import postsRoutes from "./routes/api/posts.js";

// Import config (which now loads .env)
import keys from "./config/keys.js";
import passportConfig from "./config/passport.js";

const app = express();

// Security Middleware
app.use(helmet()); // Set security-related HTTP response headers

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
    process.exit(1); // Exit process with failure
  });

// Passport middleware
app.use(passport.initialize());
// Passport Config
passportConfig(passport); // This will use the updated keys

// Test the app is running
app.get("/", (req, res) => res.send("API is running..."));

// Rate Limiting - Apply to all API routes or specific ones as needed
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", apiLimiter); // Apply rate limiting to all /api routes

// Use Routes
app.use("/api/users", usersRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postsRoutes);

// Global error handler middleware (should be defined after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  // Avoid sending stack trace to client in production
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500 
                ? 'Internal Server Error' 
                : err.message;
  res.status(statusCode).json({ message });
});

const port = keys.port; // Use port from config
app.listen(port, () => console.log(`Server running on port ${port}`));
