#!/bin/bash

# DigitalOcean Deployment Script for fixturerb2b.top
# Usage: ./deploy.sh

set -e  # Exit on error

echo "======================================"
echo "FixtureRB2B Deployment Script"
echo "======================================"
echo ""

# Configuration
SERVER_IP="${1:-}"
SERVER_USER="${2:-root}"
PROJECT_NAME="fixturerb2b"
REMOTE_PATH="/opt/${PROJECT_NAME}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if server IP is provided
if [ -z "$SERVER_IP" ]; then
    log_error "Server IP is required"
    echo "Usage: $0 <server_ip> [server_user]"
    exit 1
fi

log_info "Deploying to ${SERVER_USER}@${SERVER_IP}"
echo ""

# Step 1: Build locally
log_info "Step 1: Building Docker image locally..."
docker-compose build
log_info "Build completed successfully"
echo ""

# Step 2: Create deployment package
log_info "Step 2: Creating deployment package..."
tar -czf ${PROJECT_NAME}-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
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

log_info "Package created: ${PROJECT_NAME}-deploy.tar.gz"
echo ""

# Step 3: Upload to server
log_info "Step 3: Uploading package to server..."
scp ${PROJECT_NAME}-deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}.tar.gz

# Step 4: Deploy on server
log_info "Step 4: Deploying on server..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "Setting up deployment directory..."
mkdir -p /opt/fixturerb2b
cd /opt/fixturerb2b

echo "Extracting package..."
tar -xzf /opt/fixturerb2b-deploy.tar.gz -C /opt/fixturerb2b
rm /opt/fixturerb2b-deploy.tar.gz

echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo "Stopping old containers..."
docker-compose down || true

echo "Building and starting new containers..."
docker-compose up -d --build

echo "Waiting for service to start..."
sleep 5

echo "Checking service status..."
docker-compose ps

echo "Deployment completed successfully!"
ENDSSH

# Cleanup
log_info "Cleaning up local package..."
rm ${PROJECT_NAME}-deploy.tar.gz

log_info "======================================"
log_info "Deployment completed!"
log_info "======================================"
log_info "Website should be available at:"
log_info "  - http://${SERVER_IP}"
log_info "  - http://fixturerb2b.top (after DNS propagation)"
echo ""
log_warn "Don't forget to:"
log_warn "  1. Configure SSL certificate (run certbot on server)"
log_warn "  2. Update DNS records if needed"
log_warn "  3. Test all functionality"
echo ""
