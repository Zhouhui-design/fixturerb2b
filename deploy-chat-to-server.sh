#!/bin/bash

# 聊天系统部署脚本
# 使用方法: bash deploy-chat-to-server.sh

echo "=========================================="
echo "聊天系统部署到服务器"
echo "=========================================="
echo ""

SERVER="sardenesy@159.65.140.17"
REMOTE_PATH="/var/www/chat-system"
LOCAL_PATH="/home/sardenesy/projects/fixturerb2b/chat-system"

echo "📡 服务器: $SERVER"
echo "📁 本地路径: $LOCAL_PATH"
echo "📁 远程路径: $REMOTE_PATH"
echo ""

# Step 1: 同步文件
echo "[1/3] 同步文件到服务器..."
echo "提示: 如果提示输入密码，请输入服务器密码"
echo ""

rsync -avz --delete "$LOCAL_PATH/" "$SERVER:$REMOTE_PATH/"

if [ $? -eq 0 ]; then
    echo "✅ 文件同步成功"
else
    echo "❌ 文件同步失败"
    exit 1
fi

echo ""

# Step 2: SSH 连接并重启服务
echo "[2/3] 连接到服务器并重启服务..."
echo ""

ssh "$SERVER" << 'ENDSSH'
cd /var/www/chat-system/server
pm2 restart chat-system
sleep 2
pm2 status chat-system
echo ""
echo "=== PM2 日志 (最近20行) ==="
pm2 logs chat-system --lines 20 --nostream
ENDSSH

if [ $? -eq 0 ]; then
    echo "✅ 服务重启成功"
else
    echo "❌ 服务重启失败"
    exit 1
fi

echo ""

# Step 3: 验证部署
echo "[3/3] 验证部署..."
echo ""
echo "请访问 https://chat.fixr2026.com/ 并强制刷新 (Ctrl+Shift+R)"
echo ""
echo "测试清单:"
echo "  □ PC 端页面正常显示"
echo "  □ Excel 文件上传成功"
echo "  □ MP4 视频上传成功"
echo "  □ 麦克风录音功能"
echo "  □ 语音通话功能"
echo "  □ 视频通话功能"
echo "  □ 文字翻译功能"
echo "  □ 语音翻译功能"
echo ""

echo "=========================================="
echo "🎉 部署完成！"
echo "=========================================="
echo ""
echo "如有问题，请查看 PM2 日志:"
echo "  ssh $SERVER 'pm2 logs chat-system'"
echo ""
