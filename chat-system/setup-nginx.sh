#!/bin/bash

echo "=========================================="
echo "Setting up Nginx for Chat System"
echo "=========================================="

# Step 1: Enable the site
echo "Step 1: Enabling chat-system site..."
ln -sf /etc/nginx/sites-available/chat-system /etc/nginx/sites-enabled/

# Step 2: Remove default site if exists (optional)
echo "Step 2: Checking default site..."
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "Removing default site to avoid conflicts..."
    rm -f /etc/nginx/sites-enabled/default
fi

# Step 3: Test Nginx configuration
echo "Step 3: Testing Nginx configuration..."
nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

echo "✅ Nginx configuration is valid!"

# Step 4: Restart Nginx
echo "Step 4: Restarting Nginx..."
systemctl restart nginx

if [ $? -eq 0 ]; then
    echo "✅ Nginx restarted successfully!"
else
    echo " Failed to restart Nginx!"
    exit 1
fi

# Step 5: Verify status
echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager -l | head -10
echo ""
echo "Your chat system is now accessible at:"
echo "  http://chat.fixturerb2b.top"
echo ""
echo "Check the logs if needed:"
echo "  - Access log: /var/log/nginx/chat-system-access.log"
echo "  - Error log: /var/log/nginx/chat-system-error.log"
echo "  - PM2 logs: pm2 logs chat-system"
echo ""
