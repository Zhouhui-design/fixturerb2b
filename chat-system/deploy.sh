#!/bin/bash

# Cross-Border Chat System Deployment Script

echo "=========================================="
echo "Deploying Cross-Border Chat System"
echo "=========================================="

# Check if running as root for some operations
if [ "$EUID" -ne 0 ]; then
  echo "Please run some commands with sudo if needed"
fi

# Step 1: Update system packages
echo ""
echo "Step 1: Updating system packages..."
sudo apt-get update -y

# Step 2: Install Node.js (if not installed)
echo ""
echo "Step 2: Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed: $(node --version)"
fi

# Step 3: Install MongoDB (if not installed)
echo ""
echo "Step 3: Checking MongoDB installation..."
if ! command -v mongod &> /dev/null; then
    echo "Installing MongoDB..."
    sudo apt-get install -y mongodb
    sudo systemctl enable mongodb
    sudo systemctl start mongodb
else
    echo "MongoDB is already installed"
    sudo systemctl start mongodb
fi

# Step 4: Install PM2 globally
echo ""
echo "Step 4: Installing PM2..."
sudo npm install -g pm2

# Step 5: Navigate to project directory
echo ""
echo "Step 5: Setting up project..."
cd "$(dirname "$0")"

# Step 6: Install backend dependencies
echo ""
echo "Step 6: Installing backend dependencies..."
cd server
npm install --production

# Step 7: Generate secure JWT secret
echo ""
echo "Step 7: Generating secure JWT secret..."
JWT_SECRET=$(openssl rand -hex 32)
sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env

# Step 8: Start the application with PM2
echo ""
echo "Step 8: Starting application with PM2..."
pm2 start server.js --name chat-system
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER

# Step 9: Setup firewall (optional)
echo ""
echo "Step 9: Configuring firewall..."
sudo ufw allow 3000/tcp
sudo ufw reload

# Step 10: Display status
echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Application Status:"
pm2 status
echo ""
echo "Access your application at: http://YOUR_SERVER_IP:3000"
echo ""
echo "Useful commands:"
echo "  - View logs: pm2 logs chat-system"
echo "  - Restart: pm2 restart chat-system"
echo "  - Stop: pm2 stop chat-system"
echo "  - Monitor: pm2 monit"
echo ""
