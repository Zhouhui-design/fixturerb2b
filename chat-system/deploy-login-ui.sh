#!/bin/bash

# 聊天系统登录页面 UI 完全重新设计 - 部署脚本

SERVER_IP="139.59.108.156"
SERVER_USER="root"
REMOTE_PATH="/var/www/chat-system"

echo "=========================================="
echo "聊天系统登录页面 UI 重新设计部署"
echo "=========================================="
echo ""

# 检查本地文件是否存在
echo "📋 检查本地文件..."
FILES=(
    "client/app.js"
    "client/style.css"
    "client/index.html"
    "client/mobile-fix.css"
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
tar -czf chat-system-login-ui.tar.gz client/app.js client/style.css client/index.html client/mobile-fix.css

if [ $? -ne 0 ]; then
    echo "❌ 打包失败！"
    exit 1
fi

echo "✅ 打包完成: chat-system-login-ui.tar.gz"
echo ""

# 上传到服务器
echo "🚀 上传文件到服务器 ($SERVER_IP)..."
scp chat-system-login-ui.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

if [ $? -ne 0 ]; then
    echo "❌ 上传失败！请检查网络连接和 SSH 配置"
    exit 1
fi

echo "✅ 上传成功"
echo ""

# 在服务器上解压
echo "🔧 在服务器上部署..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /var/www/chat-system
echo "备份当前版本..."
cp -r client client.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

echo "解压新版本..."
tar -xzf /tmp/chat-system-login-ui.tar.gz

echo "设置文件权限..."
chmod -R 755 client/

echo "清理临时文件..."
rm -f /tmp/chat-system-login-ui.tar.gz

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
echo "📝 本次更新内容："
echo "1. 完全重新设计登录页面 UI"
echo "2. 修复移动端布局问题"
echo "3. 优化输入框和按钮样式"
echo "4. 标题现在完整显示"
echo "5. 页面内容垂直居中"
echo ""
echo "⚠️  用户需要清除浏览器缓存或强制刷新"
echo ""
echo "📝 测试步骤："
echo "1. 访问 https://chat.fixturerb2b.top/"
echo "2. 清除浏览器缓存"
echo "3. 查看新的登录界面"
echo ""

# 清理本地打包文件
rm -f chat-system-login-ui.tar.gz

echo "✅ 部署脚本执行完成"
