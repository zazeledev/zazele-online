# Zazele Online - Testing Guide

## Test Scenarios

### 1. User Registration and Approval Flow

**Test Case 1.1: Register as Student**
1. Go to http://localhost:8000
2. Click "Register" tab
3. Fill in all fields:
   - Full Name: "John Student"
   - Email: "john@example.com"
   - Country: "South Africa"
   - Province: "Gauteng"
   - Contact: "0798420873"
   - Password: "Test@123"
   - Upload ID document (PDF or image)
   - Upload payment proof (PDF or image)
4. Click "Create Account"
5. Should see pending approval message
6. Expected: User saved in MongoDB with `approved: false`

**Test Case 1.2: Admin Login and Approve**
1. Login with admin credentials:
   - Email: "admin@zazele.com"
   - Password: "admin123"
2. Click navigation to "User Management"
3. Should see table with registered users
4. Click "View" on student registered in 1.1
5. Click "Approve Account"
6. Click "Verify ID"
7. Click "Verify Payment"
8. Expected: User's status changes to "Verified" in all categories

**Test Case 1.3: Student Login After Approval**
1. Logout admin
2. Login as student:
   - Email: "john@example.com"
   - Password: "Test@123"
3. Should see student dashboard with course modules
4. Expected: User can see modules and lessons

### 2. Student Dashboard Testing

**Test Case 2.1: View Course Modules**
1. Login as approved student
2. Scroll to "Course Modules" section
3. Click on any module to expand
4. Expected: Accordion expands to show lessons

**Test Case 2.2: View Lesson Details**
1. Login as approved student
2. Expand a module
3. Should see lesson content:
   - Lesson number and title
   - YouTube video (if youtubeURL provided)
   - Lesson description
   - Download Notes button
   - Take Quiz button
4. Expected: All elements display correctly

**Test Case 2.3: Edit Profile**
1. Login as student
2. Click profile avatar (top right)
3. Click "Edit Profile"
4. Modal should open with current data
5. Change Full Name and Contact Number
6. Click "Save Changes"
7. Expected: Profile updates and displays new info

**Test Case 2.4: Download Lesson Notes**
1. If lesson has notes uploaded:
   - Click "Download Notes" button
   - Should download PDF/file
   - Check `/uploads` directory for file

### 3. Admin Dashboard Testing

**Test Case 3.1: User Management Table**
1. Login as admin
2. Go to "User Management"
3. Should see table with columns:
   - Name
   - Email
   - Account Status
   - ID Verification
   - Payment Verification
   - Action
4. Expected: All users display correctly

**Test Case 3.2: User Detail View**
1. Click "View" on any user
2. Left panel should show:
   - Profile information
   - View ID document link
   - View payment proof link
3. Right panel should show:
   - Approve Account button
   - Verify ID button
   - Verify Payment button
4. Expected: All information accessible

**Test Case 3.3: Module Management**
1. Login as admin
2. Click "Course Modules" in navigation
3. Should see list of existing modules
4. Click "Add Module"
5. Modal opens - fill in:
   - Title: "Advanced JavaScript"
   - Description: "Learn advanced JS concepts"
   - Order: "3"
6. Click "Save Module"
7. Expected: New module appears in list

**Test Case 3.4: Edit Module**
1. In Modules section, click "Edit" on any module
2. Modal opens with current data
3. Change title and description
4. Click "Save Module"
5. Expected: Module updates in list

**Test Case 3.5: Delete Module**
1. Click "Delete" on any module
2. Confirm deletion
3. Expected: Module removed from list and MongoDB

### 4. Authentication Testing

**Test Case 4.1: Invalid Login**
1. Try logging in with wrong email
2. Expected: Error message "Invalid credentials"

**Test Case 4.2: Invalid Password**
1. Try logging in with wrong password
2. Expected: Error message "Invalid credentials"

**Test Case 4.3: Missing Fields**
1. Try registering with empty fields
2. Expected: Form validation/HTML5 errors or backend 400 error

**Test Case 4.4: Logout**
1. Login as any user
2. Click logout button
3. Expected: Redirected to landing page, localStorage cleared

### 5. Security Testing

**Test Case 5.1: Protected Routes**
1. Clear localStorage
2. Try accessing `/api/student/profile` directly
3. Expected: 401 Unauthorized error (unauthenticated)

**Test Case 5.2: Admin-Only Routes**
1. Login as student
2. Try accessing `/api/admin/users`
3. Expected: 403 Forbidden error (insufficient permissions)

**Test Case 5.3: Token Expiration** (Manual test)
1. Login and get token
2. Modify token to invalid value in localStorage
3. Try to load dashboard
4. Expected: 403 Invalid token error

### 6. File Upload Testing

**Test Case 6.1: Valid File Upload**
1. Register with PDF ID document
2. Check `/uploads` directory
3. Expected: File stored with unique name

**Test Case 6.2: Invalid File Type**
1. Try uploading executable or invalid file
2. Expected: Error message (multer validation)

**Test Case 6.3: File Serving**
1. View user details as admin
2. Click on ID document link
3. Expected: File opens/downloads from `/uploads/filename`

### 7. Responsive Design Testing

**Test Case 7.1: Mobile View**
1. Open app in mobile view (DevTools)
2. Verify:
   - All elements are readable
   - Buttons are clickable (adequate size)
   - Tables stack properly
   - Forms are usable
3. Expected: No horizontal scrolling, good layout

**Test Case 7.2: Tablet View**
1. Open app in tablet view (iPad width ~768px)
2. Verify layout adjustments
3. Expected: Layout optimized for tablet

## API Testing (Using Postman/Insomnia)

### Test Register Endpoint
```
POST http://localhost:5000/api/auth/register
Content-Type: multipart/form-data

Form Data:
- fullName: Test User
- email: test@example.com
- country: South Africa
- province: Gauteng
- password: Test@123
- contactNumber: 0798420873
- idDocument: (file)
- paymentProof: (file)

Expected: 201 Created
```

### Test Login Endpoint
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123"
}

Expected: 200 OK with token and user data
```

### Test Protected Endpoint
```
GET http://localhost:5000/api/student/profile
Authorization: Bearer <your_token_here>

Expected: 200 OK with user data
```

### Test Create Module (Admin)
```
POST http://localhost:5000/api/admin/modules
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "New Module",
  "description": "Module description",
  "order": 4
}

Expected: 201 Created with module data
```

## Database Verification

### Check Users Collection
```javascript
db.users.find({})
// Verify fields: fullName, email, passwordHash (hashed), approved, role
```

### Check Modules Collection
```javascript
db.modules.find({}).sort({ order: 1 })
// Verify: title, description, order
```

### Check Lessons Collection
```javascript
db.lessons.find({ moduleId: ObjectId("...") }).sort({ order: 1 })
// Verify: moduleId, title, youtubeURL, notesPath
```

## Performance Testing

1. **Load Test:** Create 100+ users and measure response time
2. **Upload Test:** Upload 10MB file and verify handling
3. **Scaling:** Monitor server with multiple concurrent requests

## Browser Compatibility

- Chrome/Edge: ✓
- Firefox: ✓
- Safari: ✓
- Mobile browsers: ✓

## Known Issues & Limitations

None at launch - Report issues with:
1. Steps to reproduce
2. Expected vs actual behavior
3. Browser and OS information

---

**Last Updated:** March 2, 2026
