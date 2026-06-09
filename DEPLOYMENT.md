# Zazele Online - Deployment Guide

## Pre-Deployment Checklist

- [ ] Update API_BASE_URL in frontend/js/api.js for production
- [ ] Set strong JWT_SECRET in backend `.env`
- [ ] Configure MongoDB Atlas cluster and get connection string
- [ ] Update CORS settings for production domain
- [ ] Test all features on production-like environment
- [ ] Backup MongoDB database
- [ ] Set up email notifications (optional)
- [ ] Create admin account in production database

## Backend Deployment Options

### Option 1: Heroku (Easiest)

1. **Install Heroku CLI:**
```bash
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
# Mac: brew tap heroku/brew && brew install heroku
# Linux: Download from Heroku website
```

2. **Create Heroku Account:**
   - Go to https://www.heroku.com
   - Sign up for free

3. **Deploy:**
```bash
cd backend
heroku login
heroku create zazele-online-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret_key
git push heroku main
heroku logs --tail
```

Your backend will be at: `https://zazele-online-api.herokuapp.com`

### Option 2: Railway (Modern Alternative)

1. **Sign up at:** https://railway.app
2. **Connect GitHub repository**
3. **Deploy with environment variables:**
   - MONGODB_URI
   - JWT_SECRET
   - PORT (leave empty for automatic)

### Option 3: Render

1. **Sign up at:** https://render.com
2. **Create new Web Service**
3. **Connect GitHub**
4. **Configure environment variables**
5. **Deploy**

### Option 4: AWS EC2 (Full Control)

```bash
# On AWS EC2 instance:
sudo apt update
sudo apt install nodejs npm
git clone your-repo
cd backend
npm install
sudo npm install -g pm2
pm2 start src/server.js --name zazele
pm2 startup
pm2 save
```

Use Nginx as reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

## Frontend Deployment Options

### Option 1: Netlify (Recommended for Static Files)

1. **Sign up at:** https://netlify.com
2. **Drag and drop `frontend` folder**, OR
3. **Connect GitHub:**
   - Create repository
   - Push `frontend` folder
   - Connect to Netlify
   - Auto-deploys on push

4. **Set Build Command:** None (it's static)
5. **Set Publish Directory:** `/frontend`

### Option 2: Vercel

1. **Sign up at:** https://vercel.com
2. **Import project from GitHub**
3. **Deploy**

### Option 3: GitHub Pages

1. **Push frontend to `gh-pages` branch**
2. **Enable in repository settings**
3. **Access at:** `https://yourusername.github.io/zazele-online`

### Option 4: AWS S3 + CloudFront

1. **Create S3 bucket**
2. **Upload frontend files**
3. **Configure bucket for static hosting**
4. **Set up CloudFront CDN**
5. **Set custom domain (optional)**

## Production Environment Setup

### Update Backend .env

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/zazele-online
JWT_SECRET=random_secure_key_min_32_chars_please
PORT=5000
NODE_ENV=production
SCHOOL_NAME=Zazele Academy
ADMIN_EMAIL=admin@zazele.com
ADMIN_PASSWORD=change_this_in_production
```

### Update Frontend API Base URL

In `frontend/js/api.js`, change:
```javascript
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

### CORS Configuration

In `backend/src/server.js`:
```javascript
const corsOptions = {
  origin: 'https://your-frontend-domain.com',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

## SSL/HTTPS Setup

### Automatic (Recommended)

- **Netlify/Vercel:** Automatic SSL
- **Heroku:** Free SSL at *.herokuapp.com
- **Railway:** Automatic SSL

### Manual (Custom Domain)

**Using Let's Encrypt (Free):**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

Update Nginx to use cert:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:5000;
    }
}
```

## Database Backup

### MongoDB Atlas (Cloud)

1. Go to MongoDB Atlas dashboard
2. Click "Backup" in left menu
3. Configure automatic backups (daily)
4. Download backup snapshots when needed

### Local MongoDB

```bash
# Backup
mongodump --uri "mongodb://localhost:27017/zazele-online" --out ./backup

# Restore
mongorestore --uri "mongodb://localhost:27017/zazele-online" ./backup
```

## File Storage for Production

### Cloud Storage Options

**1. AWS S3:**
```javascript
const aws = require('aws-sdk');
const s3new = new aws.S3();

// Upload files to S3 instead of local uploads/
```

**2. Firebase Storage:**
```javascript
const firebase = require('firebase-admin');
const bucket = firebase.storage().bucket();

await bucket.file(filename).save(fileBuffer);
```

**3. Cloudinary:**
```javascript
const cloudinary = require('cloudinary').v2;

// Upload and get URL
```

Current setup stores files locally - consider cloud storage for production scalability.

## Monitoring and Logging

### Using PM2 (for Node.js servers)

```bash
npm install -g pm2
pm2 start src/server.js --name zazele
pm2 monit
pm2 logs
pm2 save
pm2 startup
```

### Using CloudWatch (AWS)

```bash
npm install aws-sdk
# Configure logstream in server.js
```

### Using Papertrail (Log Management)

1. Sign up at: https://papertrailapp.com
2. View logs in real-time
3. Set up alerts

## Performance Optimization

### Frontend

- [ ] Minify CSS and JavaScript
- [ ] Enable gzip compression
- [ ] Use CDN for static files
- [ ] Optimize images
- [ ] Cache static assets

### Backend

- [ ] Enable database indexing
- [ ] Implement rate limiting
- [ ] Use caching (Redis)
- [ ] Optimize queries
- [ ] Use compression middleware

## Security for Production

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS
- [ ] Set CORS to specific domain
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Backup sensitive data
- [ ] Monitor for suspicious activity

## Domain Setup

### Windows Hosting (IIS)

1. Install Node.js on Windows Server
2. Use iisnode for IIS integration
3. Configure binding to domain

### Linux VPS

1. Update DNS records to point to VPS
2. Install and configure Nginx
3. Set up SSL certificate
4. Configure firewall (ufw)

```bash
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
```

## Post-Deployment Testing

**Production Checklist:**

1. Test registration flow end-to-end
2. Test admin approval workflow
3. Test file uploads
4. Test student login
5. Test dashboard access
6. Test mobile responsiveness
7. Test API rate limiting
8. Monitor error logs
9. Check database backup
10. Test disaster recovery

## Scaling Considerations

**For 1000+ concurrent users:**

- [ ] Implement caching (Redis)
- [ ] Use database replication
- [ ] Load balance across multiple servers
- [ ] CDN for static assets
- [ ] Implement queue system (Bull)
- [ ] Database connection pooling
- [ ] Horizontal scaling setup

## Useful Commands

```bash
# SSH into server
ssh -i key.pem ubuntu@your-server.com

# Update system
sudo apt update && sudo apt upgrade

# Monitor system
htop
df -h  # Disk usage
ps aux # Running processes

# Check MongoDB
mongo --uri "your_connection_string"
db.users.find().count()

# View backend logs
pm2 logs zazele
journalctl -u pm2-root -e
tail -f /var/log/nginx/error.log
```

## Support & Troubleshooting

**Common Issues:**

1. **502 Bad Gateway:** Backend not accessible
   - Check backend is running
   - Verify firewall rules
   - Check CORS configuration

2. **CORS Errors:** Frontend can't reach backend
   - Update API_BASE_URL
   - Configure CORS whitelist
   - Check backend is online

3. **Database Connection Error:** MongoDB unreachable
   - Verify connection string
   - Check IP whitelist (MongoDB Atlas)
   - Verify MongoDB is running

4. **File Upload Issues:** Uploads fail
   - Check disk space
   - Verify permissions
   - Use cloud storage instead

## Support

Email: support@zazele.com  
WhatsApp: 079 842 0873

---

**Deployment Version:** 1.0.0  
**Last Updated:** March 2, 2026
