#!/bin/bash
# 为 chat.fixr2026.com 创建 Nginx 配置和 SSL 证书

set -e

SERVER="root@167.99.134.217"
NEW_DOMAIN="chat.fixr2026.com"

echo "=========================================="
echo "🚀 配置 chat.fixr2026.com"
echo "=========================================="
echo ""

# 1. 检查 DNS 解析
echo "🔍 步骤 1: 检查 DNS 解析..."
DNS_RESULT=$(nslookup $NEW_DOMAIN 2>&1 | grep "Address:" | tail -1 | awk '{print $2}')

if [ "$DNS_RESULT" = "167.99.134.217" ]; then
    echo "✅ DNS 解析正确: $NEW_DOMAIN → 167.99.134.217"
else
    echo "❌ DNS 解析错误或未生效"
    echo "   当前结果: $DNS_RESULT"
    echo ""
    echo "⚠️  请先在 DNS Owl 中添加 A 记录："
    echo "   类型: A"
    echo "   主机记录: chat"
    echo "   记录值: 167.99.134.217"
    echo ""
    echo "等待 5-10 分钟后重试。"
    exit 1
fi

# 2. 创建 Nginx 配置
echo ""
echo "📝 步骤 2: 创建 Nginx 配置..."
ssh $SERVER << EOF
cat > /etc/nginx/sites-available/$NEW_DOMAIN << 'NGINX_CONF'
server {
    listen 80;
    server_name $NEW_DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $NEW_DOMAIN;

    root /var/www/chat-system/client;
    index index.html;

    # SSL 证书（先使用占位符，稍后由 Certbot 更新）
    ssl_certificate /etc/letsencrypt/live/$NEW_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$NEW_DOMAIN/privkey.pem;

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css text/javascript application/json application/javascript;

    # 上传文件静态服务
    location /uploads/ {
        alias /var/www/chat-system/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Socket.IO WebSocket 代理
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
        proxy_cache_bypass \$http_upgrade;
    }

    # API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires 0;
    }

    # 浏览器缓存
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(css|js)$ {
        expires 7d;
        add_header Cache-Control "public, must-revalidate";
        access_log off;
    }

    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires 0;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 日志
    access_log /var/log/nginx/$NEW_DOMAIN.access.log;
    error_log /var/log/nginx/$NEW_DOMAIN.error.log;
}
NGINX_CONF

echo "✅ Nginx 配置已创建"

# 创建符号链接
ln -sf /etc/nginx/sites-available/$NEW_DOMAIN /etc/nginx/sites-enabled/

# 测试配置
nginx -t

if [ \$? -eq 0 ]; then
    echo "✅ Nginx 配置语法正确"
else
    echo "❌ Nginx 配置有错误"
    exit 1
fi
EOF

# 3. 申请 SSL 证书
echo ""
echo "🔐 步骤 3: 申请 SSL 证书..."
ssh $SERVER << 'EOF'
# 尝试使用 Certbot 自动申请
certbot --nginx -d chat.fixr2026.com --non-interactive --agree-tos --email sardenesy@gmail.com --redirect || {
    echo "Certbot 自动配置失败，尝试手动方式..."
    
    # 先临时停止 Nginx
    systemctl stop nginx
    
    # 使用 standalone 模式申请
    certbot certonly --standalone -d chat.fixr2026.com --non-interactive --agree-tos --email sardenesy@gmail.com || {
        echo "SSL 证书申请失败，请手动执行："
        echo "  ssh root@167.99.134.217"
        echo "  certbot --nginx -d chat.fixr2026.com"
        exit 1
    }
    
    # 重新启动 Nginx
    systemctl start nginx
}

echo "✅ SSL 证书已申请"
EOF

# 4. 重新加载 Nginx
echo ""
echo "🔄 步骤 4: 重新加载 Nginx..."
ssh $SERVER "systemctl reload nginx"
echo "✅ Nginx 已重新加载"

# 5. 测试访问
echo ""
echo "🧪 步骤 5: 测试访问..."
sleep 3

HTTP_STATUS=$(curl -skL -o /dev/null -w "%{http_code}" https://$NEW_DOMAIN/ 2>&1)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ HTTP 访问正常 (HTTP $HTTP_STATUS)"
else
    echo "⚠️  HTTP 访问异常 (HTTP $HTTP_STATUS)"
fi

echo ""
echo "=========================================="
echo "✅ 配置完成！"
echo "=========================================="
echo ""
echo "🌐 访问地址: https://$NEW_DOMAIN/"
echo ""
echo "📋 下一步："
echo "  1. 在浏览器中访问 https://$NEW_DOMAIN/"
echo "  2. 确认聊天系统正常打开"
echo "  3. 测试聊天功能"
echo ""
echo "⚠️  注意："
echo "  - 如果 SSL 证书申请失败，请手动执行："
echo "    ssh root@167.99.134.217"
echo "    certbot --nginx -d chat.fixr2026.com"
echo ""
