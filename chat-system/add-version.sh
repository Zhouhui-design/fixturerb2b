#!/bin/bash
# Chat System Cache Busting Script
# 为聊天系统添加版本号，避免客户端缓存问题

VERSION=$(date +%Y%m%d%H%M%S)
echo "📦 聊天系统缓存优化 - 版本号: $VERSION"

CLIENT_DIR="/home/sardenesy/projects/fixturerb2b/chat-system/client"

# 需要添加版本号的 HTML 文件
HTML_FILES=("index.html" "admin.html")

echo ""
echo "🔧 正在为 HTML 文件添加资源版本号..."

for file in "${HTML_FILES[@]}"; do
    if [ -f "$CLIENT_DIR/$file" ]; then
        echo "  - 处理 $file"
        
        # 为 CSS 文件添加版本号
        sed -i "s/href=\"\([^\"]*\.css\)\"/href=\"\1?v=$VERSION\"/g" "$CLIENT_DIR/$file"
        
        # 为 JS 文件添加版本号
        sed -i "s/src=\"\([^\"]*\.js\)\"/src=\"\1?v=$VERSION\"/g" "$CLIENT_DIR/$file"
        
        echo "    ✅ 已添加版本号 ?v=$VERSION"
    else
        echo "  ⚠️  文件不存在: $file"
    fi
done

echo ""
echo "✅ 缓存优化完成！"
echo ""
echo " 更新的文件："
for file in "${HTML_FILES[@]}"; do
    if [ -f "$CLIENT_DIR/$file" ]; then
        echo "  - $file (v=$VERSION)"
    fi
done

echo ""
echo " 下一步："
echo "  1. 运行: bash deploy-chat-cache-fix.sh"
echo "  2. 或直接执行: rsync -avz chat-system/client/ root@167.99.134.217:/var/www/chat-system/client/"
echo ""
