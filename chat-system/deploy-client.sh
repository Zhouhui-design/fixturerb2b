#!/bin/bash

# 聊天系统快速部署脚本 - 仅更新客户端文件

echo "=========================================="
echo "聊天系统快速部署"
echo "=========================================="

SERVER_IP="167.99.134.217"
REMOTE_PATH="/var/www/chat-system/client"
LOCAL_PATH="./client"

echo ""
echo "正在同步客户端文件到服务器..."
echo ""

# 使用rsync同步文件（SSH免密连接）
rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no" $LOCAL_PATH/ root@$SERVER_IP:$REMOTE_PATH/

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 客户端文件同步成功！"
    echo ""
    echo "正在重启服务..."
    
    # 通过SSH重启服务
    ssh -o StrictHostKeyChecking=no root@$SERVER_IP "cd /var/www/chat-system/server && pm2 restart chat-system"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 服务重启成功！"
        echo ""
        echo "=========================================="
        echo "部署完成！"
        echo "=========================================="
        echo ""
        echo "访问地址: https://chat.fixr2026.com"
        echo ""
    else
        echo ""
        echo "❌ 服务重启失败，请手动检查"
        exit 1
    fi
else
    echo ""
    echo "❌ 文件同步失败"
    exit 1
fi
