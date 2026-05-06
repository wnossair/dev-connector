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
