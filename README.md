# Zazele Online - Complete Setup Guide

## Overview
Zazele Online is a full-featured e-learning platform built with Node.js + Express backend, MongoDB database, and vanilla JavaScript frontend with JWT authentication.

## Project Structure

```
zazele-online/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Module.js
│   │   │   └── Lesson.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── student.js
│   │   │   ├── admin.js
│   │   │   └── courses.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   └── courseController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── api.js
        ├── auth.js
        ├── student-dashboard.js
        ├── admin-dashboard.js
        └── app.js
```

## Backend Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and JWT secret:
```
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/zazele-online
JWT_SECRET=your_secure_random_secret_key
PORT=5000
NODE_ENV=development
SCHOOL_NAME=Zazele Online
ADMIN_EMAIL=admin@zazele.com
ADMIN_PASSWORD=admin123
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### MongoDB Setup

You can use MongoDB Atlas (cloud) or local MongoDB:

**MongoDB Atlas (Recommended for production):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Click "Connect" and get your connection string
5. Paste it in your `.env` file (replace username and password)

**Local MongoDB:**
1. Install MongoDB Community Server
2. Use: `mongodb://localhost:27017/zazele-online`

## Frontend Setup

### Development

The frontend is a single-page application. Serve it using any HTTP server:

**Using Python:**
```bash
cd frontend
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npm install -g http-server
cd frontend
http-server
```

**Using VS Code Live Server:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

Access the app at `http://localhost:8000` (or your configured port)

### Production Deployment

For production, serve the frontend files using:
- Nginx
- Apache
- Express static middleware
- Cloud storage (AWS S3, Cloudflare, etc.)

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: multipart/form-data

Body:
- fullName (string)
- email (string)
- country (string)
- province (string)
- password (string)
- contactNumber (string)
- idDocument (file)
- paymentProof (file)

Response:
{
  "message": "Account created successfully",
  "userId": "user_id"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "user@example.com",
    "role": "student",
    "approved": false
  }
}
```

### Student Routes (Protected with JWT)

#### Get Profile
```
GET /api/student/profile
Authorization: Bearer <token>

Response:
{
  "_id": "user_id",
  "fullName": "John Doe",
  "email": "user@example.com",
  ...all user fields...
}
```

#### Update Profile
```
PUT /api/student/profile
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "fullName": "Jane Doe",
  "contactNumber": "+27798420873",
  "email": "newemail@example.com"
}

Response:
{
  "message": "Profile updated successfully",
  "user": {...updated user...}
}
```

### Course Routes (Public)

#### Get All Modules
```
GET /api/courses/modules

Response:
[
  {
    "_id": "module_id",
    "title": "Module Title",
    "description": "Module description",
    "order": 1
  }
]
```

#### Get Module with Lessons
```
GET /api/courses/modules/:moduleId

Response:
{
  "_id": "module_id",
  "title": "Module Title",
  "description": "...",
  "lessons": [
    {
      "_id": "lesson_id",
      "title": "Lesson Title",
      "youtubeURL": "https://youtube.com/watch?v=...",
      "description": "...",
      "notesPath": "filename.pdf",
      "order": 1
    }
  ]
}
```

### Admin Routes (Protected with JWT + Admin Role)

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer <admin_token>

Response: [all users array]
```

#### Get User by ID
```
GET /api/admin/users/:userId
Authorization: Bearer <admin_token>
```

#### Approve User
```
PUT /api/admin/users/:userId/approve
Authorization: Bearer <admin_token>

Response:
{
  "message": "User account approved",
  "user": {...updated user...}
}
```

#### Verify ID Document
```
PUT /api/admin/users/:userId/verify-id
Authorization: Bearer <admin_token>
```

#### Verify Payment Proof
```
PUT /api/admin/users/:userId/verify-payment
Authorization: Bearer <admin_token>
```

#### Create Module
```
POST /api/admin/modules
Authorization: Bearer <admin_token>
Content-Type: application/json

Body:
{
  "title": "New Module",
  "description": "Module description",
  "order": 2
}
```

#### Create Lesson
```
POST /api/admin/lessons
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Body:
- moduleId (string)
- title (string)
- youtubeURL (string)
- description (string)
- order (number)
- notes (file, optional)
```

## User Flows

### Student Registration and Login

1. **Registration:**
   - User fills registration form with personal details
   - Uploads ID document and payment proof
   - Account is created with `approved: false`
   - User sees pending approval page

2. **Admin Approval:**
   - Admin reviews user documents
   - Admin verifies ID and payment proof
   - Admin approves account
   - User can now login

3. **Student Dashboard:**
   - Student logs in with email and password
   - JWT token is stored in browser localStorage
   - Student sees course modules and lessons
   - Student can view profile and update information

### Admin Functions

1. **User Management:**
   - View all registered users
   - See approval status, ID verification, and payment verification
   - Click on user to view details and documents
   - Approve accounts, verify documents

2. **Course Management:**
   - Create, edit, and delete modules
   - Create, edit, and delete lessons within modules
   - Upload lesson notes and resources
   - Set module and lesson order

## Database Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  country: String,
  province: String,
  passwordHash: String,
  contactNumber: String,
  idDocumentPath: String,
  paymentProofPath: String,
  approved: Boolean,
  idVerified: Boolean,
  paymentVerified: Boolean,
  role: "student" | "admin",
  enrolledCourses: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Modules Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  order: Number,
  createdAt: Date
}
```

### Lessons Collection
```javascript
{
  _id: ObjectId,
  moduleId: ObjectId (ref: Module),
  title: String,
  youtubeURL: String,
  description: String,
  notesPath: String,
  quiz: String,
  order: Number,
  createdAt: Date
}
```

## Security Features

- **Passwords:** Hashed with bcryptjs before storage
- **Authentication:** JWT tokens with 7-day expiration
- **Authorization:** Role-based access control (student/admin)
- **File Uploads:** Multer middleware with file type validation
- **CORS:** Configured to allow frontend-backend communication
- **Validation:** Input validation on all endpoints

## File Uploads

Files are stored in `/backend/uploads` directory:
- ID documents and payment proofs from registration
- Lesson notes uploaded by admins

Files are served at: `http://localhost:5000/uploads/filename`

For production, consider using cloud storage (AWS S3, Google Cloud Storage, etc.)

## Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string in `.env`
- Ensure IP whitelist on MongoDB Atlas

### CORS Errors
- Frontend and backend must be accessible
- Check backend CORS configuration in `server.js`
- Frontend URL should be in CORS whitelist

### File Upload Issues
- Check `/uploads` directory exists
- Verify file permissions
- Check file size limits in `upload.js` middleware

### JWT Token Errors
- Ensure token is in `Authorization: Bearer <token>` format
- Check token expiration (7 days)
- Clear localStorage and re-login if needed

## Deployment

### Backend Deployment (Heroku, Railway, Render, AWS)

1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables (MONGODB_URI, JWT_SECRET)
4. Deploy

### Frontend Deployment (Netlify, Vercel, GitHub Pages)

1. Configure API_BASE_URL to production backend URL
2. Push to GitHub
3. Connect repository to deployment platform
4. Deploy

## Development Tips

- Use `npm run dev` for development with auto-reload
- Check browser console for frontend errors
- Use Postman/Insomnia to test API endpoints
- Monitor MongoDB using MongoDB Compass

## Support

WhatsApp: 079 842 0873

---

**Version:** 1.0.0  
**Last Updated:** March 2, 2026
