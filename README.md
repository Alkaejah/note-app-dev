# Notes App API

A modern, secure note-taking API built with NestJS, featuring Google OAuth authentication, user management, and comprehensive note CRUD operations with pagination.

## 🚀 Features

- **Google OAuth 2.0 Authentication** - Secure login with Google accounts
- **JWT Token-based Authorization** - Stateless authentication for API requests
- **User Management** - Admin-only user listing with pagination
- **Notes CRUD Operations** - Full create, read, update, delete functionality
- **User-scoped Notes** - Each user can only access their own notes
- **Pagination Support** - Efficient data retrieval for large datasets
- **Input Validation** - Comprehensive validation using class-validator
- **Swagger Documentation** - Interactive API documentation
- **Comprehensive Testing** - Unit tests with Jest and E2E tests with Supertest

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (Latest LTS)
- **pnpm** (Latest LTS) - `npm install -g pnpm`
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **Google Cloud Console** account for OAuth setup

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alkaejah/note-app-dev.git
   cd note-app-dev
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000

   # Database
   MONGO_URI=mongodb://localhost:27017/notes-app

   # JWT Configuration
   JWT_SECRET=your-jwt-secret-here

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   ```

## 🔐 Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as application type
   - Add authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Copy the Client ID and Client Secret to your `.env` file

4. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - Fill in the required information
   - Add your Google account as a test user if needed

## 🚀 Running the Application

### Development Mode
```bash
pnpm run start:dev
```
The application will start on `http://localhost:3000`

### Build
```bash
pnpm run build
```

## 🧪 Testing

This project includes comprehensive testing with **Jest** for unit tests and **Supertest** for end-to-end API testing.

### Unit Tests
```bash
# Run all unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:cov
```

### End-to-End Tests with Supertest
```bash
# Run E2E tests (uses Supertest for HTTP endpoint testing)
pnpm run test:e2e
```

**E2E Test Coverage:**
- Authentication endpoints (Google OAuth redirects)
- Protected route access control
- CRUD operations for notes
- User management (admin access)
- Error handling and validation

### Test Coverage
```bash
# Generate coverage report
pnpm run test:cov
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication

This API uses **Google OAuth 2.0** for authentication. All protected endpoints require a valid JWT token in the Authorization header.

#### Authentication Flow

1. **Initiate Google Login**
   ```
   GET /api/auth/google
   ```
   Redirects to Google OAuth consent screen

2. **Google OAuth Callback**
   ```
   GET /api/auth/callback/google
   ```
   Handles the OAuth callback and returns JWT token

3. **Use JWT Token**
   Include the token in subsequent requests:
   ```
   Authorization: Bearer <jwt_token>
   ```

### API Endpoints

#### Authentication Endpoints

##### Start Google OAuth Login
```http
GET /api/auth/google
```

**Response:** Redirects to Google OAuth

##### Google OAuth Callback
```http
GET /api/auth/callback/google
```

**Response:**
```json
{
  "message": "Login successful",
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Notes Endpoints

##### Get Notes (Authenticated Users)
```http
GET /api/notes?page=1&limit=10&tag=work&category=personal
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `tag` (optional): Filter by tag
- `category` (optional): Filter by category

**Response:**
```json
{
  "notes": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My Note",
      "content": "Note content",
      "tags": ["work"],
      "category": "Work",
      "userId": "user123",
      "createdAt": "2025-11-12T15:59:10.536Z",
      "updatedAt": "2025-11-12T15:59:10.536Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

##### Create Note
```http
POST /api/notes
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My New Note",
  "content": "This is the content of my note",
  "tags": ["important", "work"],
  "category": "Work"
}
```

**Response:**
```json
{
  "message": "Note succesffully created.",
  "newNote": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My New Note",
    "content": "This is the content of my note",
    "tags": ["important", "work"],
    "category": "Work",
    "userId": "user123",
    "createdAt": "2025-11-12T15:59:10.536Z",
    "updatedAt": "2025-11-12T15:59:10.536Z"
  }
}
```

##### Get Single Note
```http
GET /api/notes/{noteId}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Result",
  "note": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Note",
    "content": "Note content",
    "tags": ["work"],
    "category": "Work",
    "userId": "user123",
    "createdAt": "2025-11-12T15:59:10.536Z",
    "updatedAt": "2025-11-12T15:59:10.536Z"
  }
}
```

##### Update Note
```http
PUT /api/notes/{noteId}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Note Title",
  "content": "Updated content",
  "tags": ["updated"],
  "category": "Personal"
}
```

**Response:**
```json
{
  "message": "Note successfully updated.",
  "updatedNote": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Note Title",
    "content": "Updated content",
    "tags": ["updated"],
    "category": "Personal",
    "userId": "user123",
    "createdAt": "2025-11-12T15:59:10.536Z",
    "updatedAt": "2025-11-12T16:00:00.000Z"
  }
}
```

##### Delete Note
```http
DELETE /api/notes/{noteId}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Note successfully deleted.",
  "deletedNote": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Note",
    "content": "Note content",
    "tags": ["work"],
    "category": "Work",
    "userId": "user123",
    "createdAt": "2025-11-12T15:59:10.536Z",
    "updatedAt": "2025-11-12T15:59:10.536Z"
  }
}
```

#### Users Endpoints (Admin Only)

##### Get All Users
```http
GET /api/users?page=1&limit=10
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "users": [
    {
      "_id": "69149dc2a1da63737296e648",
      "email": "user@example.com",
      "name": "User Name",
      "profilePicture": "https://example.com/avatar.jpg",
      "role": "user",
      "createdAt": "2025-11-12T14:46:26.963Z",
      "updatedAt": "2025-11-12T14:46:26.963Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

## 👥 User Role Management

### User Roles
- **`user`**: Regular user (access to own notes only)
- **`admin`**: Administrator (access to all users and system management)

### Changing User Roles

**Note**: User roles are changed manually in the database.

#### MongoDB Compass
1. Connect to database
2. Find user in `users` collection
3. Update `role` field to `"user"` or `"admin"`
4. Save changes

### Admin Setup
1. Login with Google OAuth using desired admin account
2. Update role in database using MongoDB
3. Verify admin access with `GET /api/users`

## 🔍 Swagger Documentation

Interactive API documentation is available at:
```
http://localhost:3000/api
```

The Swagger UI provides:
- Complete endpoint documentation
- Interactive request testing
- Authentication integration
- Response examples

## 🏗️ Project Structure

```
src/
├── app.controller.ts          # Root controller
├── app.module.ts              # Root module
├── app.service.ts             # Root service
├── auth/                      # Authentication module
│   ├── auth.controller.ts     # OAuth endpoints
│   ├── auth.module.ts         # Auth module configuration
│   ├── auth.service.ts        # JWT token generation
│   ├── google.strategy.ts     # Google OAuth strategy
│   ├── jwt.strategy.ts        # JWT validation strategy
│   ├── jwt-auth.guard.ts      # JWT authentication guard
│   ├── admin.guard.ts         # Admin role guard
│   └── user/                  # User management
│       ├── user.controller.ts # User CRUD operations
│       ├── user.service.ts    # User business logic
│       ├── user.module.ts     # User module
│       └── interface/         # TypeScript interfaces
├── note/                      # Notes module
│   ├── note.controller.ts     # Note CRUD endpoints
│   ├── note.service.ts        # Note business logic
│   ├── note.module.ts         # Note module
│   ├── dto/                   # Data transfer objects
│   ├── interface/             # TypeScript interfaces
│   └── schema/                # MongoDB schemas
├── types/                     # Shared type definitions
└── main.ts                    # Application entry point
```

## 🛠️ Technology Stack & Testing

### Core Technologies
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database with Mongoose ODM
- **Google OAuth 2.0** - Secure authentication

### Testing Stack
- **Jest** - JavaScript testing framework
- **Supertest** - HTTP endpoint testing for E2E tests
- **Coverage Reports** - Test coverage analysis

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  profilePicture: String,
  role: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Note Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  tags: [String],
  category: String,
  userId: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```
