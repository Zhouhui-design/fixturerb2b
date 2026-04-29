#!/bin/bash
set -e

# FixturerB2B Top Deployment Script
# Server: DigitalOcean
# User: root (SSH key authentication)

# 配置
SERVER="root@fixturerb2b.top"
REMOTE_PATH="/var/www/fixturerb2b.top"
BACKUP_PATH="/var/www/fixturerb2b.top_backup_$(date +%Y%m%d_%H%M%S)"

echo "🚀 开始部署 fixturerb2b.top..."

# 1. 本地构建
echo "[1/6] 执行本地构建..."
npm run build
echo "✅ 构建完成"

# 2. 备份服务器当前版本
echo "[2/6] 备份服务器当前版本..."
ssh $SERVER "cp -r $REMOTE_PATH $BACKUP_PATH"
echo "✅ 备份完成，备份路径：$BACKUP_PATH"

# 3. 清理旧文件
REMOTE_PATH="/var/www/fixturerb2b.top"

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

# 5. 健康检查 - 使用Host头访问正确的站点
echo "[5/7] 执行健康检查..."
sleep 3
STATUS_CODE=$(ssh $SERVER "curl -s -o /dev/null -w \"%{http_code}\" -H 'Host: fixturerb2b.top' http://localhost")
if [ "$STATUS_CODE" -eq 200 ] || [ "$STATUS_CODE" -eq 301 ]; then
  echo "✅ 健康检查通过，网站状态码：$STATUS_CODE"
else
  echo "❌ 健康检查失败，状态码：$STATUS_CODE，执行回滚..."
  ssh $SERVER "rm -rf $REMOTE_PATH && cp -r $BACKUP_PATH $REMOTE_PATH && systemctl restart nginx"
  echo "✅ 回滚完成，网站已恢复到上一版本"
  exit 1
fi

# 6. 验证GA代码
echo "[6/7] 验证GA代码..."
GA_EXISTS=$(ssh $SERVER "curl -s -H 'Host: fixturerb2b.top' http://localhost | grep -q 'G-LWZXF5WGFB' && echo 1 || echo 0")
if [ "$GA_EXISTS" -eq 1 ]; then
  echo "✅ GA代码验证通过"
else
  echo "⚠️ GA代码未找到，请注意检查，但部署继续"
fi

echo ""
echo "🎉 部署完成！"
echo "🌐 网站地址：https://fixturerb2b.top"
echo "📦 备份版本：$BACKUP_PATH"
echo "🔄 回滚命令：ssh $SERVER 'rm -rf $REMOTE_PATH && cp -r $BACKUP_PATH $REMOTE_PATH && systemctl restart nginx'"
