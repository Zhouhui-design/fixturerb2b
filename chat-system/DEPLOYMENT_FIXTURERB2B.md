# Deployment Guide for fixturerb2b.top

## 🎯 Overview

This guide will help you deploy the Cross-Border Chat System on your DigitalOcean Singapore server alongside your existing website at `fixturerb2b.top`.

---

## 📋 Prerequisites

### Server Requirements
- ✅ Ubuntu system (you have this)
- ✅ Root or sudo access
- ✅ Domain: fixturerb2b.top pointing to your server
- ✅ Minimum 1GB RAM recommended (2GB+ ideal)
- ✅ At least 5GB free disk space

### What You Need
1. SSH access to your DigitalOcean server
2. Your existing website files location
3. Nginx already installed (or we'll install it)

---

## 🚀 Deployment Steps

### Step 1: Connect to Your Server

```bash
ssh root@your_server_ip
# or
ssh your_username@your_server_ip
```

### Step 2: Update System

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### Step 3: Install Node.js (if not installed)

```bash
# Check if Node.js is installed
node --version

# If not installed, install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

### Step 4: Install MongoDB

```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Add MongoDB repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB
sudo systemctl daemon-reload
sudo systemctl enable mongod
sudo systemctl start mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### Step 5: Upload Chat System to Server

#### Option A: Using Git (Recommended)

```bash
# On your local machine, push code to GitHub first
cd /home/sardenesy/projects/chat-system
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/chat-system.git
git push -u origin main

# On your server
cd /var/www
git clone https://github.com/yourusername/chat-system.git
cd chat-system/server
npm install --production
```

#### Option B: Using SCP/SFTP

```bash
# From your local machine
scp -r /home/sardenesy/projects/chat-system user@your_server_ip:/var/www/

# On your server
cd /var/www/chat-system/server
npm install --production
```

#### Option C: Using rsync

```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /home/sardenesy/projects/chat-system/ \
  user@your_server_ip:/var/www/chat-system/

# On your server
cd /var/www/chat-system/server
npm install --production
```

### Step 6: Configure Environment Variables

```bash
cd /var/www/chat-system/server

# Create .env file
nano .env
```

Add these settings:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chat_system
JWT_SECRET=$(openssl rand -hex 32)  # Generate a secure secret
NODE_ENV=production
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

### Step 7: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Start the chat application
cd /var/www/chat-system/server
pm2 start server.js --name chat-system

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u $USER --hp /home/$USER
```

### Step 8: Configure Nginx as Reverse Proxy

```bash
# Install Nginx if not already installed
sudo apt-get install -y nginx

# Create Nginx configuration for chat
sudo nano /etc/nginx/sites-available/chat.fixturerb2b.top
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name chat.fixturerb2b.top;

    # Redirect HTTP to HTTPS (we'll add SSL later)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chat.fixturerb2b.top;

    # SSL certificates (we'll generate these with Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/chat.fixturerb2b.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chat.fixturerb2b.top/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # Static files
    location /static/ {
        alias /var/www/chat-system/client/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/chat.fixturerb2b.top /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### Step 9: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d chat.fixturerb2b.top

# Auto-renewal is setup automatically
# Test renewal
sudo certbot renew --dry-run
```

### Step 10: Configure Firewall

```bash
# Enable UFW if not already enabled
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000/tcp  # For direct access (optional)
sudo ufw enable

# Check status
sudo ufw status
```

### Step 11: DNS Configuration

Add these DNS records in your domain provider (where fixturerb2b.top is managed):

```
Type: A
Name: chat
Value: your_server_ip
TTL: 3600

Or if using wildcard:
Type: A
Name: *
Value: your_server_ip
```

Wait for DNS propagation (usually 5-30 minutes).

---

## 🔧 Integration with Your Website

### Option 1: Subdomain Access (Recommended)

Users access chat at: `https://chat.fixturerb2b.top`

Add a chat button/link on your main website:

```html
<!-- Add to your website header/footer -->
<a href="https://chat.fixturerb2b.top" target="_blank" class="chat-button">
    💬 Chat with Us
</a>
```

### Option 2: Embedded Widget (Advanced)

Embed the chat directly in your website using an iframe:

```html
<!-- Add to fixturerb2b.top -->
<div id="chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
    <button onclick="toggleChat()" style="padding: 15px 25px; background: #667eea; color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 16px;">
        💬 Chat Now
    </button>
    <iframe id="chat-iframe" src="https://chat.fixturerb2b.top" 
            style="display: none; width: 400px; height: 600px; border: none; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
    </iframe>
</div>

<script>
function toggleChat() {
    const iframe = document.getElementById('chat-iframe');
    if (iframe.style.display === 'none') {
        iframe.style.display = 'block';
    } else {
        iframe.style.display = 'none';
    }
}
</script>
```

### Option 3: Same Domain Path

If you want chat at `fixturerb2b.top/chat`:

Update Nginx config:

```nginx
server {
    listen 443 ssl http2;
    server_name fixturerb2b.top;

    # ... your existing website config ...

    # Chat system
    location /chat/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

---

## 📊 Monitoring & Maintenance

### Check Application Status

```bash
# View PM2 status
pm2 status

# View logs
pm2 logs chat-system

# Monitor in real-time
pm2 monit
```

### Useful PM2 Commands

```bash
# Restart application
pm2 restart chat-system

# Stop application
pm2 stop chat-system

# View detailed info
pm2 show chat-system

# Reload without downtime
pm2 reload chat-system
```

### Backup MongoDB

```bash
# Create backup script
nano /usr/local/bin/backup-mongodb.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mongodump --out $BACKUP_DIR/backup_$TIMESTAMP

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;

echo "Backup completed: $TIMESTAMP"
```

Make executable and add to cron:

```bash
chmod +x /usr/local/bin/backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e
```

Add:
```
0 2 * * * /usr/local/bin/backup-mongodb.sh >> /var/log/mongodb-backup.log 2>&1
```

### Update Application

```bash
cd /var/www/chat-system
git pull  # If using Git
# or upload new files

cd server
npm install --production
pm2 restart chat-system
```

---

## 🔐 Security Best Practices

### 1. Update JWT Secret
```bash
cd /var/www/chat-system/server
openssl rand -hex 32
# Copy the output and update .env file
nano .env
# Paste the new secret
pm2 restart chat-system
```

### 2. Enable Automatic Security Updates
```bash
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. Setup Fail2Ban
```bash
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. Regular Updates
```bash
# Weekly update schedule
sudo apt-get update && sudo apt-get upgrade -y
cd /var/www/chat-system/server
npm audit fix
pm2 restart chat-system
```

---

## 🎯 Quick Start Checklist

- [ ] SSH into DigitalOcean server
- [ ] Update system packages
- [ ] Install Node.js
- [ ] Install MongoDB
- [ ] Upload chat system files
- [ ] Install npm dependencies
- [ ] Configure .env file
- [ ] Install and configure PM2
- [ ] Setup Nginx reverse proxy
- [ ] Configure SSL with Let's Encrypt
- [ ] Update DNS records
- [ ] Test chat system
- [ ] Integrate with main website
- [ ] Setup monitoring
- [ ] Configure backups

---

## 🆘 Troubleshooting

### Chat Not Loading

```bash
# Check if PM2 is running
pm2 status

# Check logs
pm2 logs chat-system

# Check if port 3000 is listening
sudo netstat -tulpn | grep 3000

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### MongoDB Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Check certificate
sudo certbot certificates
```

### High Memory Usage

```bash
# Check memory usage
free -h

# Check PM2 memory
pm2 monit

# Restart if needed
pm2 restart chat-system
```

---

## 📞 Support

If you encounter issues:

1. Check logs: `pm2 logs chat-system`
2. Check Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Check MongoDB: `sudo systemctl status mongod`
4. Review this guide
5. Check server resources: `htop`

---

## ✅ Success Verification

After deployment, verify:

1. ✅ Visit `https://chat.fixturerb2b.top` - should load
2. ✅ Register a test user
3. ✅ Send a test message
4. ✅ Test video call
5. ✅ Check SSL certificate (green lock)
6. ✅ Integrate with main website
7. ✅ Test from different devices

---

## 🎉 You're Ready!

Your chat system is now deployed and ready to serve your international customers on fixturerb2b.top!

**Estimated deployment time**: 30-60 minutes
**Difficulty level**: Medium
**Maintenance required**: Minimal (automated with PM2)

Good luck with your B2B business! 🚀
