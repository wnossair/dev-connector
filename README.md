# DevConnector

A full-stack social network for developers. Users create profiles featuring their experience and education, connect with other developers, and engage in a social feed where they post, comment, and like content.

## Features

- 👤 **Developer Profiles**: Showcase your professional experience, education, skills, and GitHub repositories
- 💬 **Social Feed**: Create posts, comment, and like contributions from the developer community
- 🐙 **GitHub Integration**: Automatically display your latest public repositories on your profile
- 🔐 **Secure Authentication**: JWT-based auth with password hashing via bcryptjs
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Stack

- **Frontend**: React 19, TypeScript, Vite, React Router 7, Zustand, Axios
- **Backend**: Node.js >= 20, Express, TypeScript, Mongoose, Passport JWT
- **Cross-cutting**: Structured logging (Pino), request correlation, global error handling, type safety end-to-end

## Runtime Requirements

- Node.js >= 20.0.0
- npm
- MongoDB (Atlas or local instance)

## Deployment

Automated deployment with Render + Terraform + GitHub Actions is documented in:

- `docs/deployment/render-terraform-github-actions.md`

This guide includes:

- infrastructure setup with Terraform
- CI/CD workflow behavior
- required GitHub secrets
- step-by-step manual actions that must be done in Render, Terraform Cloud, and GitHub

## Monorepo Structure

```
.
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── stores/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── errors/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
└── package.json
```

## Backend Architecture

The server is organized into **thin routes and thick services**:

- **Routes** (`src/routes/`): Parse HTTP input, validate with middleware, call services, return responses
- **Services** (`src/services/`): Contain all business logic (auth, profile management, posts, GitHub integration)
- **Models** (`src/models/`): Mongoose schemas for User, Profile, and Post
- **Middleware** (`src/middleware/`): Request logging (with correlation IDs), validation, error handling, async wrapper
- **Types** (`src/types/`): Shared TypeScript interfaces and Express extensions
- **Utils** (`src/utils/`): Logger configuration and response standardization

This separation makes code testable, reusable, and keeps concerns isolated.

## Logging and Request Tracing

Every request gets a unique correlation ID:

- If the client sends `x-request-id` or `x-correlation-id`, it's used
- Otherwise, a UUID is generated automatically
- The ID is returned in response header `x-request-id`
- All logs for that request include the correlation ID, enabling full request tracing across middleware, services, and error handlers

In development, logs are pretty-printed. In production, they're JSON for log aggregation tools.

## Frontend Architecture

The client is organized for clarity and fast iteration, with a thin view layer and small, focused stores:

- **State Management**: Zustand is used for lightweight, typed stores. Key stores live under `client/src/stores/`:
  - `useAuthStore.ts` — authentication, token handling, current user
  - `usePostStore.ts` — single-post operations and editing
  - `usePostListStore.ts` — listing, filtering, pagination
  - `useProfileStore.ts` — profile CRUD and related forms
  - `useErrorStore.ts` — centralized error notifications
  - `syncPostStores.ts` — synchronization between post stores

- **Components**: Organized by feature (auth, dashboard, post, profile, developers) and shared UI under `client/src/components/common/`.

- **API Layer**: `client/src/api/` contains thin API wrappers (Axios-based) and `createApi` helpers that return typed `ApiResponse<T>` shapes—this keeps UI code focused on state and rendering.

- **Types**: Domain types live under `client/src/types/` and are exported via `client/src/types/index.ts`. The type system is the single source of truth for client-server contracts.

## TypeScript Strategy

- **Strict Mode & Path Aliases**: `tsconfig.json` enables `strict` and path aliases for clearer imports and safer refactors.
- **Type Flow**: Shared types model API responses and domain entities (auth, profile, post). The client imports types from `client/src/types/` and mirrors server response shapes to ensure end-to-end safety.
- **Type Definitions**: 46 domain-specific types are organized by area (auth, profile, post, api, error, common). See `docs/typescript-migration/MIGRATION_COMPLETE_SUMMARY.md` for a complete breakdown.
- **Checks Before Commit**: Run `npm run type-check --prefix client` and `npm run type-check --prefix server` during CI and locally to prevent regressions.

## Backend Architecture Details

The server follows a "thin routes / thick services" pattern with several additional conventions:

- **Error Handling**: A custom `AppError` (in `server/src/errors/AppError.ts`) standardizes status codes, messages, and metadata. All errors pass through centralized `errorHandler` middleware which formats responses as `ErrorResponse`.
- **Validation**: Request validation is implemented via `server/src/middleware/validation.ts` and per-route validators. Validation failures return a structured `ValidationError` object to the client.
- **Async Handler Pattern**: `server/src/middleware/asyncHandler.ts` wraps async route handlers to forward errors to the central error handler without try/catch clutter.
- **Data Model Relationships**: Models express clear relationships:
  - `User` stores auth credentials and basic profile references
  - `Profile` contains extended profile data (experience, education, social links) and references the `User`
  - `Post` references author `User` and embeds comments/likes metadata

## Client–Server Contract

- **Typed API Responses**: The API surface uses a small set of response shapes (see `client/src/types/api.types.ts`): `ApiResponse<T>`, `ErrorResponse`, and `ValidationError`. The client API helpers return these shapes so components receive typed data.
- **Authentication Flow**: Login returns a token payload; the client stores tokens in the auth store and sends `Authorization: Bearer <token>` on protected requests.
- **Validation & Errors**: The client expects validation errors in a predictable `ValidationError` format and surfaces field-level messages in forms.
- **Versioning & Stability**: Keep small additive changes to API responses; update `client/src/types/` when server shapes change and use `npm run type-check` to validate.

## Prerequisites

Before you begin, ensure you have:

- Node.js >= 20.0.0 ([download](https://nodejs.org/))
- npm (comes with Node.js)
- Git
- MongoDB instance (free tier available at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register))
- (Optional) GitHub Personal Access Token for fetching your public repositories

### Setting Up MongoDB

1. Create a free Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Build a **free M0 cluster**
3. Under **Database Access**, create a user with read/write privileges
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`)
5. Click **Connect**, select **Connect your application**, and copy your connection string
6. Keep your connection string safe for the next step

### Setting Up GitHub Personal Access Token (Optional)

To display your GitHub repos on your profile:

1. Go to GitHub **Settings** → **Developer settings** → **Personal access tokens (classic)**
2. Click **Generate new token (classic)**
3. Check only the **`public_repo`** scope
4. Copy your token immediately (you won't see it again)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/wnossair/dev-connector.git
cd dev-connector
```

### 2. Install All Dependencies

From the repository root:

```bash
npm run install-all
```

This installs dependencies for both server and client.

### 3. Configure Environment

Create `server/.env`:

```env
# Required
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/devconnector?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here_at_least_32_chars

# Optional
PORT=5000
NODE_ENV=development
GITHUB_TOKEN=your_github_token_here
```

Replace `MONGO_URI` with your connection string from MongoDB Atlas (with your credentials inserted).

### 4. Run the Application

From the repository root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000

## Development Workflow

### Running in Development Mode

```bash
# From root: run both client and server with hot reload
npm run dev

# Or run them individually:
npm run dev --prefix server      # Just the API
npm run dev --prefix client      # Just the frontend
```

### Type Checking Before Commit

TypeScript catches many bugs at compile time. Always run:

```bash
npm run type-check --prefix server
npm run type-check --prefix client
```

### Linting

Fix code style issues:

```bash
npm run lint:fix --prefix server
npm run lint:fix --prefix client
```

### Building for Production

```bash
npm run build --prefix server
npm run build --prefix client
npm start --prefix server
```

## Testing the API

Use [Postman](https://www.postman.com/) with the included collection `server/devconnector.postman_collection.json`.

**Basic workflow:**

1. POST `/api/users/register` with name, email, password
2. POST `/api/users/login` to get a JWT token
3. Add `Authorization: Bearer YOUR_TOKEN` header to access private endpoints
4. POST `/api/profile` to create your profile
5. POST `/api/posts` to create a post

## Common Issues

**Port already in use**: Change `PORT` in `server/.env`
**MongoDB connection failed**: Verify your Atlas connection string and IP whitelist
**CORS errors**: Client/server ports must match environment config
**TypeScript errors**: Run `npm run type-check` to see full error list

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run type-check` and `npm run lint:fix` before committing
4. Follow existing service/route patterns for consistency
5. Submit a pull request

## License

MIT
