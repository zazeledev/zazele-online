# Zazele Online - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                       │
│  Frontend (HTML, CSS, Vanilla JavaScript)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Landing Page → Login/Register → Dashboard/Admin     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP(S)
                             │ JSON
                    ┌────────▼────────┐
                    │   CORS Bundle   │
                    └────────┬────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    API SERVER (Express.js)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Routes:                                                │ │
│  │  /api/auth      → Login, Register                     │ │
│  │  /api/student   → Profile Management                  │ │
│  │  /api/admin     → User & Course Management            │ │
│  │  /api/courses   → Module & Lesson Access              │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Middleware:                                            │ │
│  │  JWT Authentication                                   │ │
│  │  Role-Based Authorization (Student/Admin)             │ │
│  │  File Upload Handling (Multer)                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Controllers:                                           │ │
│  │  authController   → Auth logic                        │ │
│  │  adminController  → User management                   │ │
│  │  courseController → Course management                 │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────┬─────────────────────────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      │             │
┌─────▼──────┐  ┌──▼──────────┐
│  MongoDB   │  │  /uploads   │
│ Database   │  │ (File Store)│
│  Collections:  │             │
│  - users   │  │  ID Docs    │
│  - modules │  │  Payment    │
│  - lessons │  │  Proofs     │
└────────────┘  │  Notes      │
                └─────────────┘
```

## Data Flow: User Registration to Dashboard Access

```
1. REGISTRATION
   Student Form
        ↓
   POST /api/auth/register (+ files)
        ↓
   Validation
        ↓
   Hash Password (bcryptjs)
        ↓
   Store Files in /uploads
        ↓
   Save User (approved: false)
        ↓
   Pending Approval Page

2. ADMIN APPROVAL
   Admin Views Users
        ↓
   Reviews Documents
        ↓
   Verifies ID & Payment
        ↓
   Sets approved: true
        ↓
   User Notified

3. LOGIN
   Student Login Form
        ↓
   POST /api/auth/login
        ↓
   Validate Credentials
        ↓
   Check approved status
        ↓
   Generate JWT Token
        ↓
   Dashboard Access
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (indexed, unique),
  country: String,
  province: String,
  passwordHash: String (bcrypt hashed),
  contactNumber: String,
  idDocumentPath: String,
  paymentProofPath: String,
  approved: Boolean,
  idVerified: Boolean,
  paymentVerified: Boolean,
  role: Enum("student", "admin"),
  enrolledCourses: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Modules Collection
```javascript
{
  _id: ObjectId,
  title: String (indexed),
  description: String,
  order: Number (indexed),
  createdAt: Date
}
```

### Lessons Collection
```javascript
{
  _id: ObjectId,
  moduleId: ObjectId (ref to Module, indexed),
  title: String,
  youtubeURL: String,
  description: String,
  notesPath: String,
  quiz: String,
  order: Number,
  createdAt: Date
}
```

## JWT Token Flow

```
1. User Logs In
   ├─ POST /api/auth/login
   ├─ Server validates credentials
   └─ Creates JWT token with payload:
      └─ { userId, email, role, exp: 7d }

2. Token Storage
   ├─ Stored in localStorage
   └─ Sent with every authenticated request
      └─ Header: Authorization: Bearer <token>

3. Token Validation
   ├─ Middleware checks token
   ├─ Verifies JWT signature
   ├─ Checks expiration
   └─ Attaches user data to request

4. Role-Based Access
   ├─ Student routes (requires token)
   └─ Admin routes (requires token + admin role)
```

## Authentication & Authorization

### Middleware Chain
```
Request
  ↓
CORS Check
  ↓
Body Parser
  ↓
Router (Public/Protected)
  ├─ Public: [Register, Login, Get Courses]
  │
  └─ Protected: [Student/Admin endpoints]
     ↓
     authenticateToken()
     ├─ Extract JWT from header
     ├─ Verify signature
     └─ Attach user to request
     ↓
     authorizeRole(['admin']) (optional)
     ├─ Check user role
     └─ Allow only specified roles
     ↓
     Controller Logic
```

## File Upload Pipeline

```
Client Upload
     ↓
FormData with files
     ↓
POST /api/auth/register
     ↓
Multer Middleware
├─ Parse multipart data
├─ Validate file types
├─ Check file size (max 10MB)
├─ Generate unique filename
└─ Store in /uploads
     ↓
Save filename reference in DB
     ↓
Serve via GET /uploads/:filename
```

## API Request/Response Cycle

### Public Endpoint Example
```
Request:
  POST /api/auth/login
  Content-Type: application/json
  { "email": "user@example.com", "password": "..." }

Processing:
  1. Extract email & password from body
  2. Query database for user
  3. Compare password with hash
  4. If valid: Generate token
  5. If invalid: Return 401

Response:
  {
    "token": "eyJhbGc...",
    "user": {
      "id": "...",
      "fullName": "...",
      "role": "student",
      "approved": true
    }
  }
```

### Protected Endpoint Example
```
Request:
  GET /api/student/profile
  Authorization: Bearer eyJhbGc...
  
Processing:
  1. Check Authorization header
  2. Verify JWT signature
  3. Check token expiration
  4. Extract userId from token
  5. Query database
  6. Return user data

Response:
  {
    "_id": "...",
    "fullName": "...",
    "email": "...",
    ... (all user fields except passwordHash)
  }
```

## Frontend State Management

```
localStorage
  ├─ zazele_token: JWT token string
  └─ zazele_user: User object (JSON stringified)

App State (Memory)
  ├─ Current modules (array)
  ├─ Current lessons (array)
  └─ UI states (active pages, modals, etc)
```

## Page Flow Diagram

```
                    ┌─────────────────┐
                    │   Landing Page  │
                    └────────┬────────┘
                        ↓  ↓
                    Login  Register
                        ↓  ↓
                    ┌─────────────┐
                    │ AUTH SERVER │
                    └──────┬──────┘
                           ↓
                  Check: approved?
                    ↙            ↖
                 YES              NO
                  ↓               ↓
            ┌─────────────────┐  ┌──────────────────┐
            │ Student         │  │ Pending          │
            │ Dashboard       │  │ Approval Page    │
            └────────┬────────┘  └──────────────────┘
                     ↓
            Contains:
            - Course Overview
            - Modules (Accordion)
            - Lessons in each
            - Profile Menu
```

## Admin Dashboard Flow

```
              ┌─────────────────┐
              │  Admin Login    │
              └────────┬────────┘
                       ↓
           ┌───────────────────────────┐
           │  Admin Dashboard          │
           └───────────┬───────────────┘
                    ↙  ↖
          User Mgmt      Course Mgmt
              ↓               ↓
        ┌─────────────┐  ┌──────────────┐
        │ Users List  │  │ Modules List │
        │ (All users) │  │ (All courses)│
        └──────┬──────┘  └──────┬───────┘
               ↓                ↓
        Click user → View docs  Click edit
               ↓                ↓
        Review & Verify    Create/Edit
               ↓            Module/Lesson
        Approve Account
```

## Deployment Architecture

```
                    ┌─────────────────┐
                    │   Domain Name   │
                    │  (SSL/HTTPS)    │
                    └────────┬────────┘
                          ↙  ↖
                  Frontend    Backend
                      ↓         ↓
          ┌─────────────────┐  ┌──────────────────┐
          │  Netlify/Vercel │  │  Heroku/Railway  │
          │  (Static Files) │  │  (Node.js App)   │
          └─────────────────┘  └────────┬─────────┘
                                        ↓
                             ┌──────────────────┐
                             │  MongoDB Atlas   │
                             │  (Cloud DB)      │
                             └──────────────────┘
```

## Security Layers

```
Client
  ↓
HTTPS/TLS (in transit encryption)
  ↓
CORS Policy (origin validation)
  ↓
Request Body Parser
  ↓
JWT Verification (authentication)
  ↓
Role Authorization (authorization)
  ↓
Input Validation (data validation)
  ↓
File Upload Validation (type, size checks)
  ↓
Database Layer
  ├─ Password Hashing (bcryptjs)
  └─ Sensitive field exclusion (_passwordHash)
  ↓
HTTPS Response (in transit encryption)
  ↓
Client
```

## Performance Considerations

```
Optimization Points:
├─ Frontend
│  ├─ Pagination for user lists
│  ├─ Lazy loading modules
│  └─ Caching API responses
│
├─ Backend
│  ├─ Database indexing on:
│  │  ├─ users.email
│  │  ├─ modules.order
│  │  └─ lessons.moduleId
│  ├─ Connection pooling
│  └─ Request/Response compression
│
└─ Database
   ├─ Query optimization
   ├─ Index strategy
   └─ Replication (for production)
```

---

**Version:** 1.0.0  
**Last Updated:** March 2, 2026
