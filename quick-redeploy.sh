#!/bin/bash
# 快速重新部署脚本

echo "开始重新部署..."

# 1. 上传主站文件
echo "部署主站..."
scp -r dist/* root@fixr2026.com:/var/www/fixr2026.com/

# 2. 上传聊天系统文件（复制主站文件）
echo "部署聊天系统..."
ssh root@fixr2026.com "cp -r /var/www/fixr2026.com/* /var/www/chat-system/client/ && cp /var/www/chat-system/client/chat.html /var/www/chat-system/client/index.html && chown -R www-data:www-data /var/www/chat-system/client/ && chmod -R 755 /var/www/chat-system/client/"

# 3. 重启 Nginx
echo "重启 Nginx..."
ssh root@fixr2026.com "systemctl restart nginx"

# 4. 测试
echo ""
echo "测试访问..."
sleep 2
echo "主站: $(curl -skL https://fixr2026.com/ -o /dev/null -w '%{http_code}')"
echo "聊天系统: $(curl -skL https://chat.fixturerb2b.top/ -o /dev/null -w '%{http_code}')"

echo ""
echo "部署完成！"
