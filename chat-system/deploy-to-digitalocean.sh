#!/bin/bash

# Quick Deployment Script for fixturerb2b.top
# Run this on your DigitalOcean Ubuntu server

set -e  # Exit on error

echo "=========================================="
echo "Chat System Deployment for fixturerb2b.top"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run with sudo"
    exit 1
fi

# Step 1: Update system
print_info "Step 1: Updating system packages..."
apt-get update -y > /dev/null 2>&1
apt-get upgrade -y > /dev/null 2>&1
print_success "System updated"

# Step 2: Install Node.js
print_info "Step 2: Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
    apt-get install -y nodejs > /dev/null 2>&1
    print_success "Node.js installed: $(node --version)"
else
    print_success "Node.js already installed: $(node --version)"
fi

# Step 3: Install MongoDB
print_info "Step 3: Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list > /dev/null
    apt-get update -y > /dev/null 2>&1
    apt-get install -y mongodb-org > /dev/null 2>&1
    systemctl daemon-reload
    systemctl enable mongod
    systemctl start mongod
    print_success "MongoDB installed and started"
else
    systemctl start mongod 2>/dev/null || true
    print_success "MongoDB already installed"
fi

# Step 4: Install PM2
print_info "Step 4: Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2 > /dev/null 2>&1
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

# Step 5: Install Nginx
print_info "Step 5: Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx > /dev/null 2>&1
    systemctl enable nginx
    systemctl start nginx
    print_success "Nginx installed and started"
else
    systemctl start nginx 2>/dev/null || true
    print_success "Nginx already installed"
fi

# Step 6: Setup project directory
print_info "Step 6: Setting up project directory..."
PROJECT_DIR="/var/www/chat-system"
mkdir -p $PROJECT_DIR
print_success "Project directory created: $PROJECT_DIR"

# Step 7: Instructions for file upload
echo ""
print_info "Next Steps:"
echo ""
echo "1. Upload your chat system files to: $PROJECT_DIR"
echo "   You can use:"
echo "   - SCP: scp -r /path/to/chat-system user@your_server:$PROJECT_DIR"
echo "   - SFTP: Use FileZilla or similar"
echo "   - Git: git clone your-repo $PROJECT_DIR"
echo ""
echo "2. After uploading, run these commands:"
echo ""
echo "   cd $PROJECT_DIR/server"
echo "   npm install --production"
echo ""
echo "3. Create .env file:"
echo ""
echo "   nano $PROJECT_DIR/server/.env"
echo ""
echo "   Add these lines:"
echo "   PORT=3000"
echo "   MONGODB_URI=mongodb://localhost:27017/chat_system"
echo "   JWT_SECRET=$(openssl rand -hex 32)"
echo "   NODE_ENV=production"
echo ""
echo "4. Start with PM2:"
echo ""
echo "   cd $PROJECT_DIR/server"
echo "   pm2 start server.js --name chat-system"
echo "   pm2 save"
echo "   pm2 startup systemd -u \$USER --hp /home/\$USER"
echo ""
echo "5. Configure Nginx (see DEPLOYMENT_FIXTURERB2B.md for details)"
echo ""
echo "6. Setup SSL with Let's Encrypt:"
echo ""
echo "   apt-get install -y certbot python3-certbot-nginx"
echo "   certbot --nginx -d chat.fixturerb2b.top"
echo ""

print_success "Server preparation complete!"
echo ""
echo "=========================================="
echo "Server is ready for deployment!"
echo "=========================================="
