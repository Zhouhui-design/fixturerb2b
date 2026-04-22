#!/bin/bash

# DigitalOcean Deployment Script for fixturerb2b.top
# Server: 139.59.108.156

set -e

SERVER_IP="139.59.108.156"
SERVER_USER="root"
PROJECT_NAME="fixturerb2b"
REMOTE_PATH="/opt/${PROJECT_NAME}"

echo "======================================"
echo "Deploying to DigitalOcean: ${SERVER_IP}"
echo "======================================"
echo ""

# Step 1: Build locally
echo "[1/4] Building Docker image..."
docker-compose build
echo "✓ Build completed"
echo ""

# Step 2: Create deployment package
echo "[2/4] Creating deployment package..."
tar -czf ${PROJECT_NAME}-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='.next' \
    Dockerfile \
    docker-compose.yml \
    nginx.conf \
    .dockerignore \
    package.json \
    package-lock.json \
    src/ \
    public/ \
    index.html \
    vite.config.ts \
    tsconfig*.json \
    tailwind.config.ts \
    postcss.config.js

echo "✓ Package created"
echo ""

# Step 3: Upload to server
echo "[3/4] Uploading to server..."
scp ${PROJECT_NAME}-deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/${PROJECT_NAME}-deploy.tar.gz

# Step 4: Deploy on server
echo "[4/4] Deploying on server..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "Setting up deployment directory..."
mkdir -p /opt/fixturerb2b
cd /opt/fixturerb2b

echo "Extracting package..."
tar -xzf /tmp/fixturerb2b-deploy.tar.gz -C /opt/fixturerb2b
rm /tmp/fixturerb2b-deploy.tar.gz

echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "Stopping old containers..."
docker-compose down || true

echo "Building and starting new containers..."
docker-compose up -d --build

echo "Waiting for service to start..."
sleep 5

echo "Checking service status..."
docker-compose ps

echo ""
echo "✓ Deployment completed successfully!"
echo ""
echo "Website should be available at:"
echo "  - http://139.59.108.156"
echo "  - http://fixturerb2b.top (after DNS propagation)"
ENDSSH

# Cleanup
rm ${PROJECT_NAME}-deploy.tar.gz

echo ""
echo "======================================"
echo "Local cleanup completed"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Test the website at http://139.59.108.156"
echo "2. Configure SSL: ssh root@139.59.108.156"
echo "   Then run: certbot --nginx -d fixturerb2b.top -d www.fixturerb2b.top"
echo "3. Verify DNS points to 139.59.108.156"
echo ""
