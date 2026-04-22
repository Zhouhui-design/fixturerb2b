#!/bin/bash
# Script to set environment variables for Supabase Edge Functions

echo "🔧 Setting up Email Notification Environment Variables"
echo ""
echo "Please enter your Resend API Key (starts with 're_'):"
read -s RESEND_API_KEY

echo ""
echo "Please enter your admin email address:"
read ADMIN_EMAIL

echo ""
echo "Setting environment variables..."

# Set secrets using Supabase CLI
./supabase-cli secrets set \
  RESEND_API_KEY="$RESEND_API_KEY" \
  ADMIN_EMAIL="$ADMIN_EMAIL" \
  --project-ref yaumblbimxrunltqadsq

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Environment variables set successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Create a Database Webhook in Supabase Dashboard"
    echo "2. Test by submitting a quote request"
    echo "3. Check your email for notifications"
else
    echo ""
    echo "❌ Failed to set environment variables"
    echo "Please try manually in Supabase Dashboard:"
    echo "https://supabase.com/dashboard/project/yaumblbimxrunltqadsq/settings/functions"
fi
