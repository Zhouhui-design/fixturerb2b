#!/bin/bash

# 聊天系统自动连接管理员功能修复 - 部署脚本

SERVER_IP="139.59.108.156"
SERVER_USER="root"
REMOTE_PATH="/var/www/chat-system"

echo "=========================================="
echo "聊天系统修复部署脚本 v3"
echo "=========================================="
echo ""

# 检查本地文件是否存在
echo "📋 检查本地文件..."
FILES=(
    "client/app.js"
    "client/index.html"
    "client/sw.js"
    "server/models/User.js"
    "server/routes/auth.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在！"
        exit 1
    fi
done

echo ""
echo "📦 打包文件..."
tar -czf chat-system-fix-v3.tar.gz client/ server/

if [ $? -ne 0 ]; then
    echo "❌ 打包失败！"
    exit 1
fi

echo "✅ 打包完成: chat-system-fix-v3.tar.gz"
echo ""

# 上传到服务器
echo "🚀 上传文件到服务器 ($SERVER_IP)..."
scp chat-system-fix-v3.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

if [ $? -ne 0 ]; then
    echo "❌ 上传失败！请检查网络连接和 SSH 配置"
    exit 1
fi

echo "✅ 上传成功"
echo ""

# 在服务器上解压并重启
echo "🔧 在服务器上部署..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /var/www/chat-system
echo "备份当前版本..."
cp -r client client.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
cp -r server server.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

echo "解压新版本..."
tar -xzf /tmp/chat-system-fix-v3.tar.gz

echo "设置文件权限..."
chmod -R 755 client/
chmod -R 755 server/

echo "重启后端服务..."
pm2 restart chat-server || pm2 start server/server.js --name chat-server

echo "检查服务状态..."
pm2 status chat-server

echo "清理临时文件..."
rm -f /tmp/chat-system-fix-v3.tar.gz

echo ""
echo "✅ 服务器部署完成！"
ENDSSH

if [ $? -ne 0 ]; then
    echo "❌ 服务器部署失败！"
    exit 1
fi

echo ""
echo "=========================================="
echo "🎉 部署成功！"
echo "=========================================="
echo ""
echo "⚠️  重要提示："
echo "1. 用户需要清除浏览器缓存或强制刷新（Ctrl+Shift+R）"
echo "2. 手机端用户可以长按刷新按钮 2-3 秒"
echo "3. 建议使用隐身模式测试新功能"
echo ""
echo "📝 测试步骤："
echo "1. 访问 https://chat.fixturerb2b.top/"
echo "2. 输入称呼，点击'进入聊天'"
echo "3. 查看页面上的调试信息面板"
echo "4. 确认自动连接到 Admin 账号"
echo ""
echo "📄 详细文档: FIX_AUTO_CONNECT_ADMIN.md"
echo ""

# 清理本地打包文件
rm -f chat-system-fix-v3.tar.gz

echo "✅ 部署脚本执行完成"
