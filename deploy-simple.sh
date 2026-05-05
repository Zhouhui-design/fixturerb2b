#!/bin/bash
set -e

# FixturerB2B Top Deployment Script
# Server: 139.59.108.156 (SSH key authentication)

SERVER="root@139.59.108.156"
REMOTE_PATH="/var/www/fixr2026.com"

echo "🚀 开始部署 fixr2026.com..."

# 1. 本地构建
echo "[1/4] 执行本地构建..."
npm run build
echo "✅ 构建完成"

# 2. 上传新版本
echo "[2/4] 上传新版本到服务器..."
scp -r dist/* $SERVER:$REMOTE_PATH/
echo "✅ 上传完成"

# 3. 设置文件权限并重启Nginx
echo "[3/4] 设置文件权限并重启Nginx..."
ssh $SERVER "chown -R www-data:www-data $REMOTE_PATH && chmod -R 755 $REMOTE_PATH && systemctl restart nginx"
echo "✅ 权限设置和Nginx重启完成"

# 4. 健康检查
echo "[4/4] 执行健康检查..."
sleep 3
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://fixr2026.com/ || echo "failed")

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ 部署成功! HTTP状态: $HTTP_STATUS"
    echo "🎉 网站地址: https://fixr2026.com/"
else
    echo "⚠️  健康检查返回状态: $HTTP_STATUS"
    echo "   请手动检查服务器状态"
fi

echo ""
echo "📝 部署完成总结:"
echo "  - 服务器: 139.59.108.156"
echo "  - 路径: $REMOTE_PATH"
echo "  - 访问: https://fixr2026.com/"
