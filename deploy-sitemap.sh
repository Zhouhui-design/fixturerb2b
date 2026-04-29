#!/bin/bash

# ============================================
# 自动上传Sitemap并提交到Google Search Console
# ============================================

echo "🚀 开始上传Sitemap到服务器..."
echo ""

# 检查dist目录是否存在
if [ ! -f "dist/sitemap.xml" ]; then
    echo "❌ 错误: dist/sitemap.xml 不存在"
    echo "💡 请先运行: npm run build"
    exit 1
fi

# 显示当前sitemap信息
echo "📄 本地Sitemap信息:"
ls -lh dist/sitemap.xml
echo ""

# 上传文件到服务器
echo "📤 正在上传文件到服务器..."
scp dist/sitemap.xml dist/robots.txt sardenesy@fixturerb2b.top:/usr/share/nginx/html/

if [ $? -eq 0 ]; then
    echo "✅ 文件上传成功!"
else
    echo "❌ 文件上传失败"
    exit 1
fi

echo ""
echo "🔍 验证上传..."
sleep 2

# 验证远程文件
REMOTE_SIZE=$(curl -sI https://fixturerb2b.top/sitemap.xml | grep Content-Length | awk '{print $2}')
LOCAL_SIZE=$(stat -c%s dist/sitemap.xml)

echo "本地文件大小: $LOCAL_SIZE bytes"
echo "远程文件大小: $REMOTE_SIZE bytes"

if [ "$LOCAL_SIZE" = "$REMOTE_SIZE" ]; then
    echo "✅ 文件大小匹配，上传成功!"
else
    echo "⚠️  文件大小不匹配，请检查"
fi

echo ""
echo "🌐 访问以下URL确认:"
echo "   https://fixturerb2b.top/sitemap.xml"
echo "   https://fixturerb2b.top/robots.txt"
echo ""
echo "=========================================="
echo "📋 下一步：提交到Google Search Console"
echo "=========================================="
echo ""
echo "1. 访问: https://search.google.com/search-console"
echo "2. 选择属性: https://fixturerb2b.top"
echo "3. 左侧菜单: 索引 → 站点地图"
echo "4. 在输入框中输入: sitemap.xml"
echo "5. 点击: 提交"
echo ""
echo "✅ 完成后应该看到:"
echo "   状态: 成功"
echo "   已发现的网址数: 9"
echo ""
echo "💡 提示: Google可能需要几小时到几天来处理sitemap"
echo ""
