#!/bin/bash

# Website Health Check Script
# Checks GA code, SSL, and Cloudflare status

DOMAIN="fixr2026.com"
GA_ID="G-LWZXF5WGFB"

echo "🔍 Website Health Check for $DOMAIN"
echo "======================================"
echo ""

# 1. Check if website is accessible
echo "1️⃣  Checking website accessibility..."
HTTP_CODE=$(curl -skL -o /dev/null -w "%{http_code}" https://$DOMAIN/)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ]; then
  echo "   ✅ Website is accessible (HTTP $HTTP_CODE)"
else
  echo "   ❌ Website returned HTTP $HTTP_CODE"
fi
echo ""

# 2. Check GA code
echo "2️⃣  Checking Google Analytics code..."
GA_CHECK=$(curl -skL https://$DOMAIN/ 2>/dev/null | grep -c "$GA_ID")
if [ "$GA_CHECK" -gt 0 ]; then
  echo "   ✅ GA code found: $GA_ID"
else
  echo "   ❌ GA code NOT found: $GA_ID"
fi
echo ""

# 3. Check SSL certificate
echo "3️⃣  Checking SSL certificate..."
SSL_INFO=$(echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ -n "$SSL_INFO" ]; then
  echo "   ✅ SSL certificate is valid"
  echo "   $SSL_INFO" | sed 's/^/      /'
else
  echo "   ⚠️  Could not verify SSL certificate"
fi
echo ""

# 4. Check if using Cloudflare
echo "4️⃣  Checking Cloudflare CDN status..."
CF_HEADERS=$(curl -sI https://$DOMAIN/ 2>/dev/null | grep -i "cf-ray\|cloudflare\|server:")
if echo "$CF_HEADERS" | grep -qi "cloudflare"; then
  echo "   ✅ Using Cloudflare CDN"
  echo "$CF_HEADERS" | sed 's/^/      /'
elif echo "$CF_HEADERS" | grep -qi "nginx"; then
  echo "   ℹ️  Not using Cloudflare (direct to Nginx)"
  echo "$CF_HEADERS" | sed 's/^/      /'
else
  echo "   ⚠️  Could not determine CDN status"
fi
echo ""

# 5. Check DNS propagation
echo "5️⃣  Checking DNS resolution..."
DNS_IP=$(dig +short $DOMAIN @1.1.1.1 2>/dev/null | head -1)
if [ -n "$DNS_IP" ]; then
  echo "   ✅ DNS resolves to: $DNS_IP"
else
  echo "   ⚠️  DNS resolution failed or slow"
fi
echo ""

# 6. Check response time
echo "6️⃣  Checking response time..."
RESPONSE_TIME=$(curl -skL -o /dev/null -w "%{time_total}" https://$DOMAIN/ 2>/dev/null)
if [ -n "$RESPONSE_TIME" ]; then
  echo "   ⏱️  Response time: ${RESPONSE_TIME}s"
  if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
    echo "   ✅ Fast response (< 1s)"
  elif (( $(echo "$RESPONSE_TIME < 3.0" | bc -l) )); then
    echo "   ⚠️  Moderate response (1-3s)"
  else
    echo "   ❌ Slow response (> 3s)"
  fi
else
  echo "   ⚠️  Could not measure response time"
fi
echo ""

# Summary
echo "======================================"
echo "📊 Summary:"
echo "   Domain: $DOMAIN"
echo "   GA Code: $([ $GA_CHECK -gt 0 ] && echo '✅' || echo '❌') $GA_ID"
echo "   Cloudflare: $(echo "$CF_HEADERS" | grep -qi "cloudflare" && echo '✅' || echo 'ℹ️  No')"
echo "   SSL: $([ -n "$SSL_INFO" ] && echo '✅' || echo '⚠️')"
echo "   Status: HTTP $HTTP_CODE"
echo ""
echo "💡 Tips:"
if ! echo "$CF_HEADERS" | grep -qi "cloudflare"; then
  echo "   - Consider enabling Cloudflare CDN for better performance"
  echo "   - See CLOUDFLARE_CDN_SETUP.md for configuration guide"
fi
if [ "$GA_CHECK" -eq 0 ]; then
  echo "   - GA code is missing, check index.html"
fi
echo ""
