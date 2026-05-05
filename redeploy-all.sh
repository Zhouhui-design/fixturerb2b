#!/bin/bash
# 完整重新部署脚本 - 从 0 开始
# 用途：清理服务器旧文件，重新部署所有项目

set -e

SERVER="root@fixr2026.com"
LOCAL_DIST="./dist"

echo "=========================================="
echo "🚀 完整重新部署脚本"
echo "=========================================="
echo ""

# 1. 检查本地构建
echo "📦 步骤 1: 检查本地构建文件..."
if [ ! -d "$LOCAL_DIST" ]; then
    echo "❌ dist 目录不存在，请先运行: npm run build"
    exit 1
fi
echo "✅ 本地构建文件存在"

# 2. 清理服务器旧文件
echo ""
echo " 步骤 2: 清理服务器旧文件..."
ssh $SERVER << 'REMOTE_CLEAN'
echo "清理主站目录..."
rm -rf /var/www/fixr2026.com/*

echo "清理聊天系统目录..."
rm -rf /var/www/chat-system/client/*

echo "✅ 旧文件已清理"
REMOTE_CLEAN

# 3. 部署主站
echo ""
echo "📤 步骤 3: 部署主站 (fixr2026.com)..."
rsync -avz --delete \
    --exclude='*.map' \
    $LOCAL_DIST/ $SERVER:/var/www/fixr2026.com/

echo "✅ 主站已部署"

# 4. 部署聊天系统
echo ""
echo "📤 步骤 4: 部署聊天系统 (chat.fixturerb2b.top)..."

# 复制聊天系统文件（从主站复制，因为聊天系统是主站的一部分）
ssh $SERVER << 'REMOTE_CHAT'
echo "部署聊天系统..."
cp -r /var/www/fixr2026.com/* /var/www/chat-system/client/

# 确保 chat.html 作为 index.html
if [ -f /var/www/chat-system/client/chat.html ]; then
    cp /var/www/chat-system/client/chat.html /var/www/chat-system/client/index.html
    echo "✅ chat.html 已复制为 index.html"
fi

# 设置权限
chown -R www-data:www-data /var/www/chat-system/client/
chmod -R 755 /var/www/chat-system/client/

echo "✅ 聊天系统已部署"
REMOTE_CHAT

# 5. 检查并修复 Nginx 配置
echo ""
echo "🔧 步骤 5: 检查 Nginx 配置..."
ssh $SERVER << 'REMOTE_NGINX'
echo "检查主站配置..."
if [ ! -f /etc/nginx/sites-available/fixr2026.com ]; then
    echo "创建主站 Nginx 配置..."
    cat > /etc/nginx/sites-available/fixr2026.com << 'NGINX_CONF'
server {
    listen 80;
    server_name fixr2026.com www.fixr2026.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fixr2026.com www.fixr2026.com;

    ssl_certificate /etc/letsencrypt/live/fixr2026.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fixr2026.com/privkey.pem;

    root /var/www/fixr2026.com;
    index index.html;

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_vary on;

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX_CONF
    echo "✅ 主站配置已创建"
fi

echo "检查聊天系统配置..."
if [ ! -f /etc/nginx/sites-available/chat.fixturerb2b.top ]; then
    echo "创建聊天系统 Nginx 配置..."
    cat > /etc/nginx/sites-available/chat.fixturerb2b.top << 'NGINX_CONF'
server {
    listen 80;
    server_name chat.fixturerb2b.top;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chat.fixturerb2b.top;

    ssl_certificate /etc/letsencrypt/live/chat.fixturerb2b.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chat.fixturerb2b.top/privkey.pem;

    root /var/www/chat-system/client;
    index index.html;

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # WebSocket 代理（如果需要）
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # API 代理（如果需要）
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX_CONF
    echo "✅ 聊天系统配置已创建"
fi

# 启用站点
echo "启用站点..."
ln -sf /etc/nginx/sites-available/fixr2026.com /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/chat.fixturerb2b.top /etc/nginx/sites-enabled/

# 删除 default
rm -f /etc/nginx/sites-enabled/default

echo "测试 Nginx 配置..."
nginx -t

if [ $? -eq 0 ]; then
    echo "重启 Nginx..."
    systemctl restart nginx
    echo "✅ Nginx 已重启"
else
    echo "❌ Nginx 配置有错误，请检查"
    exit 1
fi
REMOTE_NGINX

# 6. 验证部署
echo ""
echo " 步骤 6: 验证部署..."
sleep 3

echo "测试主站..."
MAIN_STATUS=$(curl -skL https://fixr2026.com/ -o /dev/null -w "%{http_code}" --max-time 10 2>&1)
if [ "$MAIN_STATUS" = "200" ]; then
    echo "✅ 主站正常 (HTTP $MAIN_STATUS)"
else
    echo "️  主站异常 (HTTP $MAIN_STATUS)"
fi

echo "测试聊天系统..."
CHAT_STATUS=$(curl -skL https://chat.fixturerb2b.top/ -o /dev/null -w "%{http_code}" --max-time 10 2>&1)
if [ "$CHAT_STATUS" = "200" ]; then
    echo "✅ 聊天系统正常 (HTTP $CHAT_STATUS)"
else
    echo "️  聊天系统异常 (HTTP $CHAT_STATUS)"
fi

# 7. 检查 DNS
echo ""
echo "🌐 步骤 7: 检查 DNS 解析..."
echo "fixr2026.com:"
nslookup fixr2026.com | grep "Address:" | tail -1
echo "chat.fixturerb2b.top:"
nslookup chat.fixturerb2b.top | grep "Address:" | tail -1

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo ""
echo "📋 部署摘要："
echo "  - 主站: https://fixr2026.com"
echo "  - 聊天系统: https://chat.fixturerb2b.top"
echo "  - 服务器: 167.99.134.217"
echo ""
echo "🧪 测试命令："
echo "  curl -skL https://fixr2026.com/"
echo "  curl -skL https://chat.fixturerb2b.top/"
echo ""
echo "️  如果仍然无法访问，请检查："
echo "  1. DNS 解析是否正确指向 167.99.134.217"
echo "  2. 浏览器缓存（清除缓存或使用无痕模式）"
echo "  3. 防火墙规则（端口 80, 443 是否开放）"
echo ""
