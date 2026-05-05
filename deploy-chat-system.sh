#!/bin/bash
set -e

# Chat System Deployment Script
# Deploy to new server: 167.99.134.217
# Domain: chat.fixturerb2b.top

SERVER="root@167.99.134.217"
REMOTE_CHAT_PATH="/var/www/chat-system/client"
REMOTE_SERVER_PATH="/var/www/chat-system/server"

echo "🚀 开始部署聊天系统到 chat.fixturerb2b.top..."
echo "📡 服务器: $SERVER"
echo ""

# 1. 本地构建
echo "[1/5] 执行本地构建..."
npm run build
echo "✅ 构建完成"
echo ""

# 2. 备份服务器当前版本
BACKUP_PATH="/var/www/chat-system_backup_$(date +%Y%m%d_%H%M%S)"
echo "[2/5] 备份服务器当前版本..."
ssh $SERVER "cp -r /var/www/chat-system $BACKUP_PATH" || true
echo "✅ 备份完成: $BACKUP_PATH"
echo ""

# 3. 清理旧文件并上传新版本
echo "[3/5] 清理服务器旧文件..."
ssh $SERVER "cd $REMOTE_CHAT_PATH && rm -rf assets *.html *.js *.css *.json *.svg *.png *.ico" || true
echo "✅ 旧文件清理完成"
echo ""

echo "[4/5] 上传新版本到服务器..."
# 上传所有dist文件到聊天系统目录
scp dist/chat.html $SERVER:$REMOTE_CHAT_PATH/
scp dist/site.webmanifest $SERVER:$REMOTE_CHAT_PATH/ || true
scp -r dist/assets $SERVER:$REMOTE_CHAT_PATH/
scp dist/vite.svg $SERVER:$REMOTE_CHAT_PATH/ 2>/dev/null || true
scp dist/favicon-*.png $SERVER:$REMOTE_CHAT_PATH/ 2>/dev/null || true

# 重要: 复制chat.html为index.html (Nginx需要index.html)
ssh $SERVER "cd $REMOTE_CHAT_PATH && cp chat.html index.html"
echo "✅ 上传完成"
echo ""

# 4. 设置文件权限
echo "[5/5] 设置文件权限..."
ssh $SERVER "chown -R www-data:www-data $REMOTE_CHAT_PATH && chmod -R 755 $REMOTE_CHAT_PATH"
echo "✅ 权限设置完成"
echo ""

# 5. 验证部署
echo "🔍 验证部署..."
sleep 2

# 检查HTML文件
HTML_CHECK=$(ssh $SERVER "curl -s -o /dev/null -w '%{http_code}' -H 'Host: chat.fixturerb2b.top' http://localhost")
if [ "$HTML_CHECK" = "200" ]; then
    echo "✅ HTML文件访问正常 (HTTP $HTML_CHECK)"
else
    echo "❌ HTML文件访问失败 (HTTP $HTML_CHECK)"
fi

# 检查关键JS文件
NEW_CHAT_JS=$(grep -oP 'src="/assets/js/chat-\K[^"]+' dist/chat.html)
if [ -n "$NEW_CHAT_JS" ]; then
    JS_CHECK=$(ssh $SERVER "curl -s -o /dev/null -w '%{http_code}' -H 'Host: chat.fixturerb2b.top' http://localhost/assets/js/$NEW_CHAT_JS")
    if [ "$JS_CHECK" = "200" ]; then
        echo "✅ Chat JS文件访问正常 (HTTP $JS_CHECK)"
    else
        echo "❌ Chat JS文件访问失败 (HTTP $JS_CHECK)"
    fi
fi

# 检查CSS文件
NEW_CSS=$(grep -oP 'href="/assets/css/\K[^"]+' dist/chat.html)
if [ -n "$NEW_CSS" ]; then
    CSS_CHECK=$(ssh $SERVER "curl -s -o /dev/null -w '%{http_code}' -H 'Host: chat.fixturerb2b.top' http://localhost/assets/css/$NEW_CSS")
    if [ "$CSS_CHECK" = "200" ]; then
        echo "✅ CSS文件访问正常 (HTTP $CSS_CHECK)"
    else
        echo "❌ CSS文件访问失败 (HTTP $CSS_CHECK)"
    fi
fi

echo ""
echo "═══════════════════════════════════════════"
echo "🎉 聊天系统部署完成！"
echo "═══════════════════════════════════════════"
echo ""
echo "🌐 访问地址: https://chat.fixturerb2b.top/"
echo "📦 备份位置: $BACKUP_PATH"
echo ""
echo "🔄 回滚命令:"
echo "   ssh $SERVER 'rm -rf /var/www/chat-system && cp -r $BACKUP_PATH /var/www/chat-system'"
echo ""
echo "⚠️  重要提示:"
echo "   1. 请强制刷新浏览器 (Ctrl+Shift+R 或 Cmd+Shift+R)"
echo "   2. 清除浏览器缓存"
echo "   3. 检查开发者工具Console是否有错误"
echo ""
