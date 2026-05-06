# Quick Start Guide

## Project Structure
```
chat-system/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── Message.js
│   │   ├── Remark.js
│   │   └── Suggestion.js
│   ├── routes/            # API endpoints
│   │   ├── auth.js
│   │   ├── user.js
│   │   └── suggestion.js
│   ├── utils/             # Utility functions
│   │   └── cleanup.js
│   ├── server.js          # Main server file
│   ├── package.json       # Dependencies
│   └── .env               # Environment variables
├── client/                # Frontend
│   ├── index.html         # HTML structure
│   ├── style.css          # Styles
│   └── app.js             # Frontend logic
├── deploy.sh              # Deployment script
├── README.md              # Documentation
└── .gitignore             # Git ignore rules
```

## Prerequisites Installation

### 1. Install MongoDB
```bash
# For Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify MongoDB is running
mongod --version
```

### 2. Node.js is already installed ✓
- Node.js: v25.9.0
- npm: 11.12.1

### 3. Dependencies are already installed ✓
All backend dependencies have been installed in `server/node_modules/`

## Running the Application

### Option 1: Development Mode (with auto-reload)
```bash
cd server
npm run dev
```

### Option 2: Production Mode
```bash
cd server
npm start
```

### Option 3: Using PM2 (Recommended for Production)
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server/server.js --name chat-system

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Monitor the application
pm2 monit

# View logs
pm2 logs chat-system
```

## Testing the Application

1. **Start MongoDB** (if not already running):
   ```bash
   sudo systemctl start mongodb
   ```

2. **Start the server**:
   ```bash
   cd server
   npm start
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

4. **Test the features**:
   - Register with a username (min 3 characters)
   - Search for other users
   - Start chatting
   - Try video calls (requires camera/microphone permissions)
   - Test voice-to-text
   - Add social links
   - Submit suggestions

## API Endpoints

### Authentication
```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'

# Verify token
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_JWT_TOKEN"}'
```

### Users
```bash
# Search users
curl "http://localhost:3000/api/user/search?q=test"

# Get user details
curl http://localhost:3000/api/user/USER_ID

# Update social links
curl -X PUT http://localhost:3000/api/user/USER_ID/social-links \
  -H "Content-Type: application/json" \
  -d '{"socialLinks": {"wechat": "your_wechat_id"}}'
```

### Suggestions
```bash
# Submit suggestion
curl -X POST http://localhost:3000/api/suggestions \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID", "username": "testuser", "content": "Great app!"}'

# Get all suggestions
curl http://localhost:3000/api/suggestions
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Start MongoDB if not running
sudo systemctl start mongodb

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 PID
```

### Permission Issues
```bash
# Make sure you have proper permissions
chmod -R 755 /home/sardenesy/projects/chat-system
```

## Production Deployment

### Using the Deployment Script
```bash
./deploy.sh
```

This script will:
1. Update system packages
2. Install Node.js (if needed)
3. Install MongoDB (if needed)
4. Install PM2
5. Install project dependencies
6. Generate secure JWT secret
7. Start the application with PM2
8. Configure firewall

### Manual Production Setup

1. **Install PM2**:
   ```bash
   npm install -g pm2
   ```

2. **Start with PM2**:
   ```bash
   cd server
   pm2 start server.js --name chat-system
   pm2 save
   pm2 startup
   ```

3. **Setup Nginx (Optional but Recommended)**:
   ```bash
   sudo apt-get install nginx
   
   # Create Nginx config
   sudo nano /etc/nginx/sites-available/chat-system
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/chat-system /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Setup SSL with Let's Encrypt**:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Security Checklist

- [ ] Change JWT_SECRET in `.env` file
- [ ] Enable HTTPS/TLS
- [ ] Setup firewall rules
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Backup MongoDB database
- [ ] Monitor server logs

## Useful Commands

### PM2 Commands
```bash
pm2 status              # Show all processes
pm2 logs chat-system    # View logs
pm2 restart chat-system # Restart application
pm2 stop chat-system    # Stop application
pm2 delete chat-system  # Delete from PM2
pm2 monit              # Monitor resources
```

### MongoDB Commands
```bash
mongo                   # Open MongoDB shell
show dbs               # Show databases
use chat_system        # Switch to chat_system database
show collections       # Show collections
db.users.find()        # Query users
db.messages.find()     # Query messages
```

### System Commands
```bash
# Check server status
sudo systemctl status mongodb
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/error.log
pm2 logs chat-system

# Check ports
sudo netstat -tulpn | grep :3000
```

## Support

For issues or questions:
1. Check the logs: `pm2 logs chat-system`
2. Review the README.md
3. Check MongoDB connection
4. Verify environment variables in `.env`

## Next Steps

1. ✅ Project structure created
2. ✅ All code files created
3. ✅ Dependencies installed
4. ⏳ Install MongoDB
5. ⏳ Start the server
6. ⏳ Test the application
7. ⏳ Deploy to production

Enjoy your Cross-Border Chat System! 🚀
