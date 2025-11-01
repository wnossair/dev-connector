# DevConnector Server - TypeScript Edition

A robust social network API built with Express.js, TypeScript, MongoDB, and Passport.js authentication.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 14.0.0
- MongoDB instance running
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file (see .env.example)
cp .env.example .env

# Add your environment variables
# MONGO_URI=mongodb://...
# JWT_SECRET=your_secret_key
# GITHUB_TOKEN=optional_github_token
```

### Development

```bash
# Run in development mode with hot reload
npm run dev

# Run type check
npm run type-check

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

### Production

```bash
# Build TypeScript to JavaScript
npm run build

# Run production server
npm start
```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── server.ts        # Entry point
├── dist/                # Compiled JavaScript (generated)
├── .env                 # Environment variables (not in git)
├── .env.example         # Example environment variables
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (JWT Strategy)
- **Validation**: Express-Validator
- **Security**: Helmet, Rate Limiting
- **Dev Tools**: tsx (hot reload), ESLint

## 📡 API Endpoints

### Users (`/api/users`)

- `POST /register` - Register new user
- `POST /login` - Login user (returns JWT)
- `GET /current` - Get current user (Private)

### Profiles (`/api/profile`)

- `GET /me` - Get current user's profile (Private)
- `POST /` - Create/update profile (Private)
- `GET /all` - Get all profiles
- `GET /user/:user_id` - Get profile by user ID
- `POST /experience` - Add experience (Private)
- `POST /education` - Add education (Private)
- `DELETE /experience/:exp_id` - Delete experience (Private)
- `DELETE /education/:edu_id` - Delete education (Private)
- `DELETE /` - Delete account & profile (Private)
- `GET /github/:username` - Get GitHub repos

### Posts (`/api/posts`)

- `GET /` - Get all posts
- `GET /:id` - Get post by ID
- `POST /` - Create post (Private)
- `DELETE /:id` - Delete post (Private)
- `POST /like/:id` - Like post (Private)
- `POST /unlike/:id` - Unlike post (Private)
- `POST /comment/:id` - Add comment (Private)
- `DELETE /comment/:id/:comment_id` - Delete comment (Private)

## 🔒 Authentication

This API uses JWT (JSON Web Tokens) for authentication.

**To access private routes:**

1. Login or register to get a token
2. Include token in Authorization header:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

## 🧪 Testing with Postman

A Postman collection is included: `devconnector.postman_collection.json`

Import this into Postman to test all endpoints.

## 📝 TypeScript Benefits

- **Full Type Safety**: Catch errors at compile time
- **IDE Support**: Better autocomplete and IntelliSense
- **Self-Documenting**: Types serve as inline documentation
- **Easier Refactoring**: TypeScript catches breaking changes

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server
npm run type-check   # Type check without emitting files
npm run lint         # Lint all TypeScript files
npm run lint:fix     # Auto-fix linting issues
npm run dev:full     # Run both server and client concurrently
```

## 🌐 Environment Variables

Create a `.env` file in the server directory:

```env
# Required
MONGO_URI=mongodb://localhost:27017/devconnector
JWT_SECRET=your_secret_key_here

# Optional
PORT=5000
NODE_ENV=development
GITHUB_TOKEN=your_github_token_for_api
```

## 🏗️ TypeScript Configuration

The project uses strict TypeScript configuration:

- Strict mode enabled
- ES2022 target
- ESNext modules
- Path aliases configured

See `tsconfig.json` for details.

## 📚 Documentation

For detailed migration information, see [TYPESCRIPT_MIGRATION.md](./TYPESCRIPT_MIGRATION.md)

## 🤝 Contributing

1. Ensure `npm run type-check` passes
2. Run `npm run lint:fix` before committing
3. Follow existing code patterns and type definitions

## 📄 License

MIT

## 👤 Author

Wassim Nossair

---

**Note**: This project has been fully migrated to TypeScript for improved developer experience and code quality.
