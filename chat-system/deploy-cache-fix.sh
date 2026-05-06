#!/bin/bash
set -e

# Chat System Cache Fix Deployment
# 部署聊天系统缓存优化版本

SERVER="root@167.99.134.217"
REMOTE_CHAT_PATH="/var/www/chat-system/client"

echo "=========================================="
echo " 部署聊天系统缓存优化版本"
echo "=========================================="
echo ""

# 1. 添加版本号
echo "[1/4] 为静态资源添加版本号..."
bash /home/sardenesy/projects/fixturerb2b/chat-system/add-version.sh
echo ""

# 2. 备份服务器当前版本
BACKUP_PATH="/var/www/chat-system_client_backup_$(date +%Y%m%d_%H%M%S)"
echo "[2/4] 备份服务器当前版本..."
ssh $SERVER "cp -r $REMOTE_CHAT_PATH $BACKUP_PATH" || true
echo "✅ 备份完成: $BACKUP_PATH"
echo ""

# 3. 上传新版本
echo "[3/4] 上传新版本到服务器..."
rsync -avz --delete \
    /home/sardenesy/projects/fixturerb2b/chat-system/client/ \
    $SERVER:$REMOTE_CHAT_PATH/
echo "✅ 上传完成"
echo ""

# 4. 更新服务器 Nginx 配置
echo "[4/4] 更新 Nginx 缓存配置..."

# 创建临时 Nginx 配置文件
cat > /tmp/chat-nginx-cache.conf << 'EOF'
# 为聊天系统添加更好的缓存控制
location /admin.html {
    proxy_pass http://localhost:3002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # HTML 不缓存
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    expires 0;
}

location /index.html {
    proxy_pass http://localhost:3002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # HTML 不缓存
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    expires 0;
}

location ~* \.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
    proxy_pass http://localhost:3002;
    expires 30d;
    add_header Cache-Control "public, immutable";
}

location ~* \.(css|js)$ {
    proxy_pass http://localhost:3002;
    # CSS 和 JS 长期缓存（因为它们有版本号）
    expires 1y;
    add_header Cache-Control "public, immutable";
}
EOF

# 上传并更新 Nginx 配置
ssh $SERVER "cat > /etc/nginx/conf.d/chat-cache-optimization.conf << 'NGINX_EOF'
$(cat /tmp/chat-nginx-cache.conf)
NGINX_EOF"

# 测试并重启 Nginx
ssh $SERVER "nginx -t && systemctl reload nginx"
echo "✅ Nginx 配置已更新并重新加载"
echo ""

# 清理临时文件
rm -f /tmp/chat-nginx-cache.conf

echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo ""
echo "📊 部署信息："
echo "  - 版本号: $(date +%Y%m%d%H%M%S)"
echo "  - 备份位置: $BACKUP_PATH"
echo "  - 服务器: $SERVER"
echo ""
echo "🎯 缓存策略："
echo "  - HTML 文件: 不缓存（每次请求都检查更新）"
echo "  - CSS/JS 文件: 1年缓存（带有版本号，更新时自动失效）"
echo "  - 图片/字体: 30天缓存"
echo ""
echo "🧪 测试验证："
echo "  1. 访问: https://chat.fixr2026.com/"
echo "  2. 访问: https://chat.fixr2026.com/admin.html"
echo "  3. 打开浏览器开发者工具 -> Network"
echo "  4. 检查 HTML 文件的响应头应该有: Cache-Control: no-cache"
echo "  5. 检查 CSS/JS 文件应该有版本号参数: ?v=20260423..."
echo ""
echo "🔄 回滚命令："
echo "  ssh $SERVER 'rm -rf $REMOTE_CHAT_PATH && cp -r $BACKUP_PATH $REMOTE_CHAT_PATH && systemctl reload nginx'"
echo ""
