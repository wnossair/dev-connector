import express from "express";
import mongoose from "mongoose";
import passport from "passport";

// Import routes
import usersRoutes from "./routes/api/users.js";
import profileRoutes from "./routes/api/profile.js";
import postsRoutes from "./routes/api/posts.js";

// Import config (which now loads .env)
import keys from "./config/keys.js";
import passportConfig from "./config/passport.js";

const app = express();

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB Config
const db = keys.mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport Config
passportConfig(passport); // This will use the updated keys

// Test the app is running
app.get("/", (req, res) => res.send("Hello World"));

// Use Routes
app.use("/api/users", usersRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postsRoutes);

const port = keys.port; // Use port from config
app.listen(port, () => console.log(`Server running on port ${port}`));
