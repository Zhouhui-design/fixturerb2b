#!/bin/bash
# 服务器端全面验证脚本
# 用途：验证服务器上所有部署的文件和功能

SERVER="root@167.99.134.217"

echo "=========================================="
echo "🔍 服务器端全面验证"
echo "=========================================="
echo ""

ERRORS=0

# 1. 服务器状态检查
echo "📊 1. 服务器状态检查"
echo "----------------------------------------"

ssh $SERVER << 'EOF'
echo "系统负载:"
uptime | awk -F'load average:' '{print $2}' | xargs

echo ""
echo "内存使用:"
free -h | grep Mem | awk '{printf "已用: %s / 总计: %s (%.1f%%)\n", $3, $2, ($3/$2)*100}'

echo ""
echo "磁盘使用:"
df -h / | tail -1 | awk '{printf "已用: %s / 总计: %s (%s)\n", $3, $2, $5}'

echo ""
echo "Nginx 状态:"
systemctl is-active nginx

echo ""
echo "PM2 进程:"
pm2 list --no-color | grep -E "online|stopped" || echo "无 PM2 进程"
EOF

# 2. 文件完整性检查
echo ""
echo "📁 2. 文件完整性检查"
echo "----------------------------------------"

# 主站文件
echo "主站关键文件:"
MAIN_FILES=("index.html" "chat.html" "assets/js" "assets/css" "images")
for file in "${MAIN_FILES[@]}"; do
    if ssh $SERVER "test -e /var/www/fixr2026.com/$file && echo 'exists'"; then
        SIZE=$(ssh $SERVER "du -sh /var/www/fixr2026.com/$file 2>/dev/null | cut -f1")
        echo "✅ $file ($SIZE)"
    else
        echo "❌ $file 缺失"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""
echo "聊天系统关键文件:"
CHAT_FILES=("index.html" "chat.html" "assets/js" "assets/css")
for file in "${CHAT_FILES[@]}"; do
    if ssh $SERVER "test -e /var/www/chat-system/client/$file && echo 'exists'"; then
        SIZE=$(ssh $SERVER "du -sh /var/www/chat-system/client/$file 2>/dev/null | cut -f1")
        echo "✅ $file ($SIZE)"
    else
        echo "❌ $file 缺失"
        ERRORS=$((ERRORS + 1))
    fi
done

# 3. HTTP 访问测试
echo ""
echo "🌍 3. HTTP 访问测试"
echo "----------------------------------------"

# 主站
MAIN_STATUS=$(curl -skL -o /dev/null -w "%{http_code}" https://fixr2026.com/ 2>&1)
MAIN_TIME=$(curl -skL -o /dev/null -w "%{time_total}" https://fixr2026.com/ 2>&1)
echo "主站 (fixr2026.com):"
echo "  HTTP 状态: $MAIN_STATUS"
echo "  响应时间: ${MAIN_TIME}s"
if [ "$MAIN_STATUS" = "200" ]; then
    echo "  ✅ 正常"
else
    echo "  ❌ 异常"
    ERRORS=$((ERRORS + 1))
fi

# 聊天系统
CHAT_STATUS=$(curl -skL -o /dev/null -w "%{http_code}" https://chat.fixturerb2b.top/ 2>&1)
CHAT_TIME=$(curl -skL -o /dev/null -w "%{time_total}" https://chat.fixturerb2b.top/ 2>&1)
echo ""
echo "聊天系统 (chat.fixturerb2b.top):"
echo "  HTTP 状态: $CHAT_STATUS"
echo "  响应时间: ${CHAT_TIME}s"
if [ "$CHAT_STATUS" = "200" ]; then
    echo "  ✅ 正常"
else
    echo "  ❌ 异常"
    ERRORS=$((ERRORS + 1))
fi

# 4. Nginx 配置检查
echo ""
echo "🔧 4. Nginx 配置检查"
echo "----------------------------------------"

ssh $SERVER << 'EOF'
echo "测试 Nginx 配置语法:"
nginx -t 2>&1 | grep -E "successful|failed"

echo ""
echo "启用的站点:"
ls -la /etc/nginx/sites-enabled/ | grep -v "^total" | awk '{print $NF}'

echo ""
echo "SSL 证书:"
echo "主站:"
openssl x509 -in /etc/letsencrypt/live/fixr2026.com/fullchain.pem -noout -dates 2>/dev/null | head -2 || echo "证书不存在"
echo ""
echo "聊天系统:"
openssl x509 -in /etc/letsencrypt/live/chat.fixturerb2b.top/fullchain.pem -noout -dates 2>/dev/null | head -2 || echo "证书不存在"
EOF

# 5. 后端服务检查
echo ""
echo "⚙️  5. 后端服务检查"
echo "----------------------------------------"

ssh $SERVER << 'EOF'
echo "PM2 进程详情:"
pm2 list --no-color

echo ""
echo "端口监听:"
ss -tlnp | grep -E ":(80|443|3000|3001) " | awk '{printf "%-20s %s\n", $4, $NF}'

echo ""
echo "MongoDB 状态:"
systemctl is-active mongod 2>/dev/null || echo "MongoDB 未运行或未安装"

echo ""
echo "Node.js 版本:"
node --version

echo ""
echo "Nginx 版本:"
nginx -v 2>&1
EOF

# 6. DNS 解析检查
echo ""
echo "🌐 6. DNS 解析检查"
echo "----------------------------------------"

MAIN_DNS=$(nslookup fixr2026.com 2>&1 | grep "Address:" | tail -1 | awk '{print $2}')
CHAT_DNS=$(nslookup chat.fixturerb2b.top 2>&1 | grep "Address:" | tail -1 | awk '{print $2}')

echo "主站 DNS: $MAIN_DNS"
echo "聊天系统 DNS: $CHAT_DNS"

# 7. 页面内容验证
echo ""
echo "📄 7. 页面内容验证"
echo "----------------------------------------"

# 获取主站内容
MAIN_CONTENT=$(curl -skL https://fixr2026.com/ 2>&1)

echo "主站内容检查:"
if echo "$MAIN_CONTENT" | grep -q "FixtureRB2B"; then
    echo "✅ 页面标题正确"
else
    echo "❌ 页面标题缺失"
    ERRORS=$((ERRORS + 1))
fi

if echo "$MAIN_CONTENT" | grep -q "G-LWZXF5WGFB"; then
    echo "✅ GA 代码存在"
else
    echo "❌ GA 代码缺失"
    ERRORS=$((ERRORS + 1))
fi

if echo "$MAIN_CONTENT" | grep -q "Chat System"; then
    echo "✅ Chat System 按钮存在"
else
    echo "❌ Chat System 按钮缺失"
    ERRORS=$((ERRORS + 1))
fi

# 获取聊天系统内容
CHAT_CONTENT=$(curl -skL https://chat.fixturerb2b.top/ 2>&1)

echo ""
echo "聊天系统内容检查:"
if echo "$CHAT_CONTENT" | grep -q "<!DOCTYPE"; then
    echo "✅ HTML 文档正常"
else
    echo "❌ HTML 文档异常"
    ERRORS=$((ERRORS + 1))
fi

# 8. 性能检查
echo ""
echo "⏱️  8. 性能检查"
echo "----------------------------------------"

ssh $SERVER << 'EOF'
echo "CPU 使用率:"
top -bn1 | grep "Cpu(s)" | awk '{printf "用户: %s%%, 系统: %s%%, 空闲: %s%%\n", $2, $4, $8}'

echo ""
echo "内存使用最多的进程:"
ps aux --sort=-%mem | head -6 | awk '{printf "%-10s %-8s %-6s %s\n", $1, $2, $4, $11}'

echo ""
echo "磁盘 I/O:"
iostat -x 1 1 2>/dev/null | grep -A 1 "Device" || echo "iostat 不可用"
EOF

# 9. 安全检
