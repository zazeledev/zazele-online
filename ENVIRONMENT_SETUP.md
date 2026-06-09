# Zazele Online - Environment Setup Instructions

## System Requirements

- **Operating System:** Windows, macOS, or Linux
- **Node.js:** v14.0.0 or higher
- **npm:** v6.0.0 or higher (comes with Node.js)
- **MongoDB:** v4.4+ (local) or MongoDB Atlas (cloud, recommended)
- **Browser:** Modern browser with ES6 support (Chrome, Firefox, Safari, Edge)
- **Disk Space:** ~500MB for development

## Installation Steps

### 1. Node.js and npm Installation

#### Windows
1. Download from https://nodejs.org/ (LTS version)
2. Run the installer
3. Choose all defaults except:
   - Enable "Add to PATH"
4. Restart terminal/command prompt

#### macOS
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org/
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify installation:**
```bash
node --version
npm --version
```

### 2. MongoDB Setup

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account with email/password
4. Create organization and project
5. Create a cluster:
   - Select "Shared" (free tier)
   - Choose region closest to you
   - Click "Create Cluster"
6. Wait for cluster to be created (5-10 minutes)
7. Click "Connect"
8. Choose "Connect your application"
9. Copy connection string
10. Replace `<password>` and `<database>` with your credentials
11. Keep this string for `.env` file

**Example connection string:**
```
mongodb+srv://username:password@cluster.mongodb.net/zazele-online
```

#### Option B: Local MongoDB

##### Windows
1. Download Windows Installer from https://www.mongodb.com/try/download/community
2. Run installer, choose defaults
3. MongoDB will start as a service
4. Connection string: `mongodb://localhost:27017/zazele-online`

##### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
# Connection: mongodb://localhost:27017/zazele-online
```

##### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
# Connection: mongodb://localhost:27017/zazele-online
```

**Test MongoDB connection:**
```bash
# Install MongoDB tools
npm install -g mongodb-cli-tools

# Connect to local
mongosh "mongodb://localhost:27017"

# Or MongoDB Atlas (replace placeholders)
mongosh "mongodb+srv://username:password@cluster.mongodb.net/zazele-online"

# List databases
show databases
```

### 3. Project Setup

#### Clone or Download the Project

```bash
# Option 1: Git Clone
git clone https://github.com/yourusername/zazele-online.git
cd zazele-online

# Option 2: Download ZIP
# Extract the zip file to your workspace
cd zazele-online
```

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Or on Windows: copy .env.example .env

# Edit .env with your MongoDB connection
# Use your favorite editor or:
# Windows: notepad .env
# macOS/Linux: nano .env
```

**Update .env file:**
```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/zazele-online
JWT_SECRET=your_random_secret_key_at_least_32_characters_long_here
PORT=5000
NODE_ENV=development
SCHOOL_NAME=Zazele Academy
ADMIN_EMAIL=admin@zazele.com
ADMIN_PASSWORD=admin123
```

**Generate JWT Secret:**
```bash
# On Windows PowerShell:
-join(1..32 | ForEach-Object { [char][byte]::random(33, 126) })

# On macOS/Linux:
openssl rand -base64 32
```

#### Frontend Setup

Frontend is a static SPA, no npm install needed. Just ensure you have a way to serve the files.

### 4. Starting Development

#### Terminal 1: Start MongoDB (if local)

```bash
# macOS/Linux
mongod

# Windows (if not running as service, otherwise skip)
mongod
```

#### Terminal 2: Start Backend Server

```bash
cd backend
npm start

# Or for development with auto-reload:
npm install -g nodemon
npm run dev
```

Expected output:
```
MongoDB connected successfully
Zazele Online backend running on http://localhost:5000
```

#### Terminal 3: Start Frontend Server

```bash
cd frontend

# Option 1: Python (most common)
python -m http.server 8000

# Option 2: Node.js http-server
npm install -g http-server
http-server

# Option 3: VS Code Live Server (easiest)
# Install extension → Right-click index.html → "Open with Live Server"
```

### 5. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:8000 (or your configured port)
- **Backend API:** http://localhost:5000/api/health

### 6. First Login

**Admin Account:**
- Email: `admin@zazele.com`
- Password: `admin123`

**Register Test Student:**
1. Click "Register"
2. Fill in test information
3. Upload sample ID document
4. Upload sample payment proof
5. Click "Create Account"
6. See pending approval message

**Admin Approval:**
1. Login as admin
2. Go to "User Management"
3. Find test student
4. Click "View"
5. Click "Approve Account"
6. Click "Verify ID"
7. Click "Verify Payment"

**Student Dashboard:**
1. Logout admin
2. Login as test student
3. See dashboard with course modules

## Environment Variables Explained

```bash
# Database connection string
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Secret key for JWT signing (use strong random string)
JWT_SECRET=your_secret_key_here_min_32_chars

# Server port
PORT=5000

# Node environment
NODE_ENV=development|production

# School name displayed in UI
SCHOOL_NAME=Zazele Academy

# Default admin account
ADMIN_EMAIL=admin@zazele.com
ADMIN_PASSWORD=admin123
```

## Project Structure Review

After setup, verify you have:

```
zazele-online/
├── backend/
│   ├── src/
│   │   ├── models/           ✓ Database schemas
│   │   ├── routes/           ✓ API endpoints
│   │   ├── controllers/      ✓ Business logic
│   │   ├── middleware/       ✓ Auth & uploads
│   │   └── server.js         ✓ Main app file
│   ├── uploads/              ✓ File storage
│   ├── package.json          ✓ Dependencies
│   ├── .env                  ✓ Environment config
│   └── node_modules/         ✓ Installed libs
├── frontend/
│   ├── index.html            ✓ Main page
│   ├── css/styles.css        ✓ Styling
│   ├── js/
│   │   ├── api.js            ✓ API client
│   │   ├── auth.js           ✓ Authentication
│   │   ├── student-dashboard.js
│   │   ├── admin-dashboard.js
│   │   └── app.js
├── README.md                 ✓ Full documentation
├── QUICKSTART.md            ✓ Quick guide
└── TESTING.md               ✓ Test cases
```

## Troubleshooting

### MongoDB Connection Error: "ECONNREFUSED"
- **For MongoDB Atlas:** Check connection string, IP whitelist, credentials
- **For Local MongoDB:** Start MongoDB service first
- **Test connection:**
  ```bash
  mongosh "your_connection_string"
  ```

### Port Already in Use
```bash
# Find process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

### npm Dependencies Error
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

### Frontend Can't Reach Backend
- Check backend is running: `curl http://localhost:5000/api/health`
- Check CORS: Should allow `http://localhost:8000`
- Check firewall settings

### File Upload Permissions Error
```bash
# Linux/macOS: Set upload folder permissions
chmod 755 backend/uploads
```

## IDE Setup Recommendations

### VS Code (Recommended)

1. **Install Extensions:**
   - Eslint
   - Prettier
   - Thunder Client (API testing)
   - MongoDB for VS Code

2. **Create `.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/backend/src/server.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

### Other IDEs
- **WebStorm:** Built-in Node.js support
- **Sublime Text:** Install Node.js plugin
- **Atom:** Install ide-atom package

## Performance Tips

1. **Keep MongoDB connection open** during development
2. **Use nodemon** for auto-reload on file changes
3. **Enable browser DevTools** to debug frontend
4. **Use MongoDB Compass** to visualize database

## Next Steps

1. ✅ Complete environment setup (this guide)
2. ✅ Read [README.md](README.md) for full documentation
3. ✅ Try test scenarios in [TESTING.md](TESTING.md)
4. ✅ Explore [ARCHITECTURE.md](ARCHITECTURE.md) for system design
5. ✅ Learn deployment in [DEPLOYMENT.md](DEPLOYMENT.md)

## Getting Help

- **MongoDB Issues:** https://docs.mongodb.com/
- **Express.js:** https://expressjs.com/
- **Node.js:** https://nodejs.org/docs/
- **JWT:** https://jwt.io/
- **Multer:** https://github.com/expressjs/multer

---

**Setup Version:** 1.0.0  
**Last Updated:** March 2, 2026  
**Estimated Setup Time:** 15-30 minutes
