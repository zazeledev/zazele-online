# Zazele Online - Quick Start

## What's Included

✅ Complete backend API with Express.js  
✅ MongoDB integration with 3 collections (Users, Modules, Lessons)  
✅ JWT authentication with role-based access control  
✅ File upload functionality (ID documents, payment proofs, lesson notes)  
✅ Student dashboard with course modules and lessons  
✅ Admin dashboard for user management and course management  
✅ Clean, minimalist, mobile-responsive UI  
✅ Complete API documentation  
✅ Testing guide with all test cases  

## 5-Minute Setup

### Backend

```bash
cd backend
npm install
```

Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/zazele-online
JWT_SECRET=your_secure_secret_key_change_this
PORT=5000
```

Start MongoDB (if local):
```bash
# Windows: mongod
# Mac: brew services start mongodb-community
# Or use MongoDB Atlas cloud
```

Start backend:
```bash
npm start
```

### Frontend

```bash
cd frontend
# Use any of these options:

# Option 1: Python
python -m http.server 8000

# Option 2: Node.js http-server
npm install -g http-server
http-server

# Option 3: VS Code Live Server (recommended)
# Install extension, right-click index.html, "Open with Live Server"
```

Access at `http://localhost:8000`

## Default Credentials

**Admin Account (created on backend initialization):**
- Email: admin@zazele.com
- Password: admin123

**Test Student (register new):**
1. Click "Register"
2. Fill form with test data
3. Will need admin approval to access dashboard

## Key Features

### Student Features
- ✓ Register with document uploads
- ✓ View approval status
- ✓ Access approved dashboard
- ✓ View course modules and lessons
- ✓ Download lesson notes
- ✓ Manage profile (name, email, contact)

### Admin Features
- ✓ Review pending students
- ✓ View/verify uploaded documents
- ✓ Approve accounts
- ✓ Verify ID documents
- ✓ Verify payment proofs
- ✓ Manage course modules
- ✓ Manage lessons (create, edit, delete)
- ✓ View user statistics

## File Structure

```
zazele-online/
├── backend/          # Express.js API
│   ├── src/
│   ├── uploads/      # User file uploads
│   └── package.json
├── frontend/         # Vanilla JS SPA
│   ├── index.html
│   ├── css/
│   └── js/
├── README.md         # Full documentation
└── TESTING.md        # Test cases
```

## API Endpoints Summary

**Auth:**
- POST /api/auth/register
- POST /api/auth/login

**Student (requires token):**
- GET /api/student/profile
- PUT /api/student/profile

**Courses (public):**
- GET /api/courses/modules
- GET /api/courses/modules/:id
- GET /api/courses/lessons/:id

**Admin (requires token + admin role):**
- GET /api/admin/users
- PUT /api/admin/users/:id/approve
- PUT /api/admin/users/:id/verify-id
- PUT /api/admin/users/:id/verify-payment
- CRUD /api/admin/modules
- CRUD /api/admin/lessons

## Database

Uses MongoDB with 3 collections:
- **users** - Student and admin accounts
- **modules** - Course modules
- **lessons** - Individual lessons within modules

All with proper relationships, validation, and indexes.

## Security

✓ Password hashing (bcryptjs)  
✓ JWT tokens (7-day expiration)  
✓ Role-based authorization  
✓ CORS protection  
✓ Input validation  
✓ File upload validation  

## Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [TESTING.md](TESTING.md) for test cases
3. Configure MongoDB connection in `.env`
4. Customize school name in `.env`
5. Deploy when ready

## Support

WhatsApp: 079 842 0873

---

**Ready to launch!** 🚀

