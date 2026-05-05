#!/bin/bash

# 聊天系统性能诊断脚本

echo "═══════════════════════════════════════════"
echo "🔍 聊天系统性能诊断"
echo "═══════════════════════════════════════════"
echo ""

SERVER="root@167.99.134.217"

# 1. 检查后端服务状态
echo "[1/6] 检查后端服务状态..."
PM2_STATUS=$(ssh $SERVER "pm2 status chat-system | grep -E 'status|online'" 2>&1)
if echo "$PM2_STATUS" | grep -q "online"; then
    echo "✅ 后端服务运行中"
else
    echo "❌ 后端服务未运行"
fi
echo ""

# 2. 检查重启次数
RESTART_COUNT=$(ssh $SERVER "pm2 status chat-system --output json | jq '.[0].restart_time'" 2>&1)
echo "[2/6] PM2重启次数: $RESTART_COUNT"
if [ "$RESTART_COUNT" -gt 100 ] 2>/dev/null; then
    echo "⚠️  警告: 重启次数过多，服务可能不稳定"
else
    echo "✅ 重启次数正常"
fi
echo ""

# 3. 测试服务器内部访问速度
echo "[3/6] 测试服务器内部访问速度..."
INTERNAL_TIME=$(ssh $SERVER "curl -s -o /dev/null -w '%{time_total}' http://localhost/chat.html" 2>&1)
echo "   服务器内部加载时间: ${INTERNAL_TIME}s"
if (( $(echo "$INTERNAL_TIME < 0.1" | bc -l) )); then
    echo "✅ 服务器内部访问快速"
else
    echo "⚠️  服务器内部访问较慢"
fi
echo ""

# 4. 检查端口占用
echo "[4/6] 检查端口占用..."
PORT_3000=$(ssh $SERVER "netstat -tlnp | grep ':3000 '" 2>&1)
PORT_3001=$(ssh $SERVER "netstat -tlnp | grep ':3001 '" 2>&1)
echo "   端口3000: $([ -n "$PORT_3000" ] && echo '被占用' || echo '空闲')"
echo "   端口3001: $([ -n "$PORT_3001" ] && echo '被占用 (chat-system)' || echo '空闲')"
echo ""

# 5. 检查MongoDB连接
echo "[5/6] 检查MongoDB状态..."
MONGO_STATUS=$(ssh $SERVER "systemctl is-active mongod" 2>&1)
if [ "$MONGO_STATUS" = "active" ]; then
    echo "✅ MongoDB运行正常"
else
    echo "❌ MongoDB未运行: $MONGO_STATUS"
fi
echo ""

# 6. 检查磁盘空间
echo "[6/6] 检查磁盘空间..."
DISK_USAGE=$(ssh $SERVER "df -h / | tail -1 | awk '{print \$5}'" 2>&1)
echo "   磁盘使用率: $DISK_USAGE"
echo ""

echo "═══════════════════════════════════════════"
echo "📊 诊断完成"
echo "═══════════════════════════════════════════"
echo ""
echo "💡 建议:"
echo "1. 如果从浏览器访问慢，检查您的代理配置"
echo "2. 确保您是通过 167.99.134.217 的代理访问"
echo "3. 清除浏览器缓存并强制刷新 (Ctrl+Shift+R)"
echo ""
