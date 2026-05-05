#!/bin/bash
set -e

# FixturerB2B Top Deployment Script
# Server: DigitalOcean
# User: root (SSH key authentication)

# 配置
SERVER="root@fixr2026.com"
REMOTE_PATH="/var/www/fixr2026.com"
BACKUP_PATH="/var/www/fixr2026.com_backup_$(date +%Y%m%d_%H%M%S)"

# Cloudflare 配置（可选）
# 在 .env 文件中设置: CF_ZONE_ID 和 CF_API_TOKEN
if [ -f .env ]; then
  source .env
fi

echo "🚀 开始部署 fixr2026.com..."

# 1. 本地构建
echo "[1/7] 执行本地构建..."
npm run build
echo "✅ 构建完成"

# 2. 备份服务器当前版本
echo "[2/7] 备份服务器当前版本..."
ssh $SERVER "cp -r $REMOTE_PATH $BACKUP_PATH"
echo "✅ 备份完成，备份路径：$BACKUP_PATH"

# 3. 清理旧文件
REMOTE_PATH="/var/www/fixr2026.com"

echo "[3/7] 清理服务器旧文件..."
ssh $SERVER "cd $REMOTE_PATH && find . -maxdepth 1 -type f -delete && rm -rf assets images"
echo "✅ 旧文件清理完成"

# 4. 上传新版本
echo "[4/7] 上传新版本到服务器..."
scp -r dist/* $SERVER:$REMOTE_PATH/
echo "✅ 上传完成"

# 5. 设置文件权限
echo "[5/7] 设置文件权限..."
ssh $SERVER "chown -R www-data:www-data $REMOTE_PATH && chmod -R 755 $REMOTE_PATH"
echo "✅ 权限设置完成"

# 6. 重启Nginx
echo "[6/7] 重启Nginx服务..."
ssh $SERVER "systemctl daemon-reload && systemctl restart nginx"
echo "✅ Nginx重启完成"

# 7. 健康检查和验证
echo "[7/7] 执行健康检查和验证..."
sleep 3

# 验证 GA 代码（通过 HTTPS）
echo "🔍 验证 GA 代码..."
GA_CHECK=$(curl -skL https://fixr2026.com/ 2>/dev/null | grep -c 'G-LWZXF5WGFB' || echo "0")
if [ "$GA_CHECK" -gt 0 ]; then
  echo "✅ GA 代码验证通过 (G-LWZXF5WGFB)"
else
  echo "⚠️ GA 代码未找到，请检查 index.html"
fi

# 清除 Cloudflare 缓存（如果配置了）
if [ -n "$CF_ZONE_ID" ] && [ -n "$CF_API_TOKEN" ]; then
  echo "🔄 清除 Cloudflare 缓存..."
  CF_RESULT=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}')
  
  if echo "$CF_RESULT" | grep -q '"success":true'; then
    echo "✅ Cloudflare 缓存已清除"
  else
    echo "⚠️ Cloudflare 缓存清除失败: $CF_RESULT"
  fi
else
  echo "ℹ️  未配置 Cloudflare，跳过缓存清除"
  echo "   如需启用，请在 .env 中设置 CF_ZONE_ID 和 CF_API_TOKEN"
fi

echo ""
echo "🎉 部署完成！"
echo "🌐 网站地址：https://fixr2026.com"
echo "📦 备份版本：$BACKUP_PATH"
echo "🔄 回滚命令：ssh $SERVER 'rm -rf $REMOTE_PATH && cp -r $BACKUP_PATH $REMOTE_PATH && systemctl restart nginx'"
