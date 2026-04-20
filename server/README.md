# DevConnector Server

TypeScript Express API for DevConnector.

## Runtime Baseline

- Node.js >= 20.0.0

## Quick Start

### Prerequisites

- **Node.js** >= 20.0.0 — [Download](https://nodejs.org/)
- **npm** >= 10.0.0 (comes with Node)
- **MongoDB Atlas** — Free sandbox cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) OR local MongoDB instance
- **GitHub Token** *(optional, for fetching GitHub profile data)* — Create a [Personal Access Token](https://github.com/settings/tokens)

### Install & Configure

1. **Copy environment template and fill in your secrets:**

   ```bash
   cp .env.example .env
   ```

   ```env
   # .env file in server/ folder
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/devconnector
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   GITHUB_TOKEN=ghp_your_github_token_here
   ```

   **Important:** Never commit `.env` — it contains secrets.

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server (with hot reload):**

   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:5000` and auto-reload on file changes.

### First Steps

1. **Test the server is running:**

   ```bash
   curl http://localhost:5000/api/users/current
   # Should return 401 (Unauthorized) — that's expected without a token
   ```

2. **Register a user:**

   ```bash
   curl -X POST http://localhost:5000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
   ```

3. **Login and get a JWT token:**

   ```bash
   curl -X POST http://localhost:5000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@example.com","password":"secret123"}'
   ```

   Copy the `token` from the response and use it in the `Authorization` header:

   ```bash
   curl http://localhost:5000/api/users/current \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

## Project Structure

```
server/
├── src/
│   ├── config/          # Environment config and Passport setup
│   ├── errors/          # Custom application error types
│   ├── middleware/      # Validation, async wrapper, error handler, request logger
│   ├── models/          # Mongoose schemas/models
│   ├── routes/          # HTTP route adapters
│   ├── services/        # Business logic layer
│   ├── types/           # Shared TypeScript types and Express extensions
│   ├── utils/           # Logger and response helpers
│   └── server.ts        # Application entry point
├── dist/                # Build output
├── .env.example
├── package.json
└── tsconfig.json
```

## Architecture & Design Philosophy

The API uses a **4-layer architecture** to keep concerns separated and code testable:

### Layer Breakdown

**Routes** → **Services** → **Models** → **Database**

```
POST /api/users/login (HTTP request)
    ↓ (1. Route parses JSON body)
UsersRoute.login()
    ↓ (2. Calls service)
AuthService.login(email, password)
    ↓ (3. Service queries data + applies business logic)
User.findOne({email}) → compare password → generate JWT
    ↓ (4. Model queries DB)
MongoDB
    ↑ (Flows back: user object → JWT token → response)
```

### Why Layered?

- **Routes are thin adapters**: Just parse HTTP input, call a service, return JSON. ~5 lines each.
- **Services hold business logic**: Register validations, login JWT generation, GitHub profile fetching — all in one place. One source of truth.
- **Models are data contracts**: Mongoose schemas define data shape. Services fetch and transform; routes never touch the DB directly.
- **Middleware adds cross-cutting concerns**: Authentication, validation, request logging, error handling — applied globally without cluttering route handlers.

**Benefit:** Services can be called from multiple routes, tested independently, or reused in scheduled jobs/webhooks.

### Service Examples

**AuthService** (`src/services/authService.ts`):
- `register(userData)` — Validate input, hash password, save user, return new user
- `login(email, password)` — Find user, verify password, generate JWT
- `getCurrentUser(userId)` — Fetch authenticated user by ID (used by `/api/users/current`)

**ProfileService** (`src/services/profileService.ts`):
- `getProfile(userId)` — Fetch user's profile
- `createOrUpdateProfile(userId, profileData)` — Validate and save profile
- `getGitHubProfile(username)` — Call GitHub API, cache result
- `getAllProfiles()` — List all developers with profiles

**PostService** (`src/services/postService.ts`):
- `createPost(userId, text)` — Save post, add timestamps
- `getAllPosts()` — Fetch all posts with author info, sorted by date
- `likePost(userId, postId)` — Toggle like (idempotent)
- `addComment(userId, postId, commentText)` — Save comment on post

### Route-Service Contract

Routes delegate to services, services never know about Express:

```typescript
// routes/api/users.ts — thin adapter
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password); // Calls service
  res.json({ token: result.token, user: result.user });
});

// services/authService.ts — pure business logic
export async function login(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('User not found', 401);
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);
  const token = generateJWT({ id: user._id });
  return { user, token };
}
```

This separation means:
- Services are framework-agnostic (could call from CLI, job queue, or another route)
- Routes are simple glue code (easy to understand flow at a glance)
- Tests can mock services without spinning up Express

## Logging and Debugging

### Request Correlation IDs

Every request gets a unique correlation ID to trace its full lifecycle:

1. Client sends `Authorization` header (if authenticated)
2. `requestLoggerMiddleware` extracts/generates a UUID correlation ID
3. ID is attached to response header: `x-request-id`
4. **Every log from that request includes the ID** → Makes debugging in logs easy

```
[2025-01-15 10:23:45] REQUEST_ID=a1b2c3d4 | POST /api/posts
[2025-01-15 10:23:45] REQUEST_ID=a1b2c3d4 | DB query: posts find
[2025-01-15 10:23:46] REQUEST_ID=a1b2c3d4 | Response 201 Created
```

To trace a specific user's activity: `grep "REQUEST_ID=a1b2c3d4" logs/server.log`

### Logger Format

**Development** (pretty-printed with colors):
```
[INFO]  app started on port 5000
[WARN]  duplicate key error: index 'email_1' violated
```

**Production** (structured JSON):
```json
{"level":"info","msg":"app started on port 5000","timestamp":"2025-01-15T10:23:45Z"}
{"level":"warn","msg":"duplicate key error","error":"index 'email_1' violated","timestamp":"2025-01-15T10:23:45Z"}
```

JSON logs pipe easily to aggregation services (CloudWatch, ELK Stack).

### Finding Logs

- **Errors with full context:** Check `src/middleware/errorHandler.ts` — all errors logged with severity (500 → error, 400 → warn)
- **Request flow:** Search for your request ID in logs to see full lifecycle
- **Service-level debug:** Each service logs failures (e.g., `ProfileService` logs GitHub rate limits, Mongoose duplicate key errors)

### Adding Logs

```typescript
import logger from '../utils/logger';

// In a service:
logger.info('User registered', { userId: user._id });
logger.warn('GitHub rate limit hit', { remaining: 5 });
logger.error('Database connection failed', { error: err.message });
```

Logs automatically include request correlation ID if called during request lifecycle.

## API Surface

### Users (`/api/users`)

- `POST /register`
- `POST /login`
- `GET /current` (private)

### Profile (`/api/profile`)

- `GET /me` (private)
- `POST /` (private)
- `GET /all`
- `GET /user/:user_id`
- `POST /experience` (private)
- `POST /education` (private)
- `DELETE /experience/:exp_id` (private)
- `DELETE /education/:edu_id` (private)
- `DELETE /` (private)
- `GET /github/:username`

### Posts (`/api/posts`)

- `GET /`
- `GET /:id`
- `POST /` (private)
- `DELETE /:id` (private)
- `POST /like/:id` (private)
- `POST /unlike/:id` (private)
- `POST /comment/:id` (private)
- `DELETE /comment/:id/:comment_id` (private)

## Scripts

```bash
npm run dev          # watch mode with tsx (auto-reload on changes)
npm run build        # compile TypeScript → dist/
npm start            # run compiled app from dist/ (production mode)
npm run type-check   # check TS types without emitting code
npm run lint         # check code style with ESLint
npm run lint:fix     # auto-fix code style issues
```

## Development Workflow

### Running the Server

```bash
# Start in development mode (auto-reload on file changes)
npm run dev

# Server will be ready at http://localhost:5000
# Logs show correlation IDs and request flow
```

### Making API Changes

1. **Add a new route** → Create handler in `src/routes/api/`
2. **Call a service** → Import and use existing service, or create new one in `src/services/`
3. **Define data shape** → Add type to `src/types/` and update Mongoose model in `src/models/`
4. **Test with curl or Postman** → Use the included `devconnector.postman_collection.json`
5. **Check logs** → Look for correlation IDs if something breaks

### Type Safety

Always run before committing:

```bash
npm run type-check
```

Catches missing types, wrong property names, signature mismatches at compile time.

### Code Style

Keep formatting consistent:

```bash
npm run lint:fix
```

Applies ESLint rules automatically. Failures become errors on type-check.

## Production Build

```bash
npm run build
npm start
```

Compiles TypeScript to `dist/`, removes dev dependencies, sets `NODE_ENV=production`. Logs output as JSON. Ready for Docker or cloud deployment.

## Troubleshooting

### "ECONNREFUSED" (MongoDB won't connect)

- **Check MongoDB is running:** `mongosh` or Atlas cluster is accessible
- **Check `MONGO_URI` in `.env`:** Should be full connection string
- **Check IP Whitelist (Atlas):** Go to Security → Network Access, add your IP

### "401 Unauthorized" on private routes

- **Send JWT token:** Include `Authorization: Bearer YOUR_TOKEN` header
- **Token expired/invalid:** Re-login to get fresh token
- **Check Passport config:** See `src/config/passport.ts` for JWT strategy setup

### TypeScript/ESLint errors after npm install

```bash
npm run type-check   # See full error list
npm run lint:fix     # Auto-fix what can be fixed
```

### Hot reload not working (npm run dev won't restart)

- **Kill process and restart:** `npm run dev` again
- **Port conflict:** Change `PORT` in `.env` if 5000 is taken

### Duplicate key error on MongoDB operations

- **Schema validation:** Check `src/models/` for unique indexes
- **Clear test data:** Delete collections if you changed schema
- **Check email/username uniqueness:** Ensure no test duplicates

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/devconnector` |
| `JWT_SECRET` | Secret key for signing JWT tokens | Any random string, 32+ chars recommended |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `GITHUB_TOKEN` | GitHub API token for fetching profiles | `ghp_xxxxx...` (optional) |

## Testing with Postman

Import `devconnector.postman_collection.json` into Postman:

1. **Register:** `POST /api/users/register` with name, email, password
2. **Login:** `POST /api/users/login` to get JWT token
3. **Authenticated requests:** Add `Authorization: Bearer YOUR_TOKEN` header
4. **Create profile:** `POST /api/profile` with skills, bio, social links
5. **Create post:** `POST /api/posts` with text
6. **Like/comment:** `POST /api/posts/like/:id`, `POST /api/posts/comment/:id`

Each endpoint shows full request/response structure for reference.
