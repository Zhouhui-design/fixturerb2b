#!/bin/bash

# Translation API Integration Deployment Script
# This script deploys the real translation API integration to production

set -e  # Exit on error

echo "🚀 Starting Translation API Integration Deployment..."
echo "================================================"

# Configuration
SERVER="root@139.59.108.156"
REMOTE_DIR="/var/www/chat-system/client"
PROJECT_DIR="/home/sardenesy/projects/fixturerb2b"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Verify local build
log_info "Step 1: Verifying local build..."
cd "$PROJECT_DIR"

if npm run build > /dev/null 2>&1; then
    log_success "Build completed successfully"
else
    log_error "Build failed! Please fix errors before deploying."
    exit 1
fi

# Step 2: Check if dist directory exists
if [ ! -d "dist" ]; then
    log_error "dist directory not found. Build may have failed."
    exit 1
fi

log_success "Build artifacts ready in dist/"

# Step 3: Upload files to server
log_info "Step 3: Uploading files to server..."

# Upload static files
log_info "Uploading HTML, CSS, and JS files..."
scp -r dist/* "$SERVER:$REMOTE_DIR/" 2>/dev/null || {
    log_error "Failed to upload files to server"
    exit 1
}

log_success "Files uploaded successfully"

# Step 4: Restart services
log_info "Step 4: Restarting services on server..."

ssh "$SERVER" << 'EOF'
    echo "Restarting Nginx..."
    systemctl reload nginx
    
    echo "Restarting PM2 processes..."
    pm2 restart chat-system 2>/dev/null || true
    
    echo "Services restarted"
EOF

log_success "Services restarted"

# Step 5: Clear CDN cache (if applicable)
log_info "Step 5: Clearing caches..."
ssh "$SERVER" "rm -rf $REMOTE_DIR/.cache/*" 2>/dev/null || true
log_success "Cache cleared"

# Step 6: Verify deployment
log_info "Step 6: Verifying deployment..."

sleep 2

# Check if site is accessible
if curl -s -o /dev/null -w "%{http_code}" "https://chat.fixr2026.com/" | grep -q "200"; then
    log_success "Website is accessible (HTTP 200)"
else
    log_warning "Website may not be accessible. Please check manually."
fi

# Check if test page is accessible
if curl -s -o /dev/null -w "%{http_code}" "https://chat.fixr2026.com/test-translation.html" | grep -q "200"; then
    log_success "Translation test page is accessible"
else
    log_warning "Test page may not be accessible yet"
fi

# Summary
echo ""
echo "================================================"
log_success "Deployment completed successfully!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Visit: https://chat.fixr2026.com/test-translation.html"
echo "2. Test the translation functionality"
echo "3. Clear browser cache if needed (Ctrl+F5)"
echo ""
echo "Documentation:"
echo "- Integration details: TRANSLATION_API_INTEGRATION.md"
echo "- Testing guide: TRANSLATION_TEST_GUIDE.md"
echo ""
