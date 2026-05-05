#!/bin/bash
# 法兰克福代理完整修复脚本
# 用途：修复 SOCKS5 代理问题，确保能正常访问 chat.fixturerb2b.top

set -e

SERVER_IP="167.99.134.217"
SERVER_USER="root"

echo "=========================================="
echo "🔧 法兰克福代理修复工具"
echo "=========================================="
echo ""

# 1. 检查服务器连接
echo " 步骤 1: 检查服务器连接..."
if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo '连接成功'" > /dev/null 2>&1; then
    echo "✅ 服务器连接正常"
else
    echo "❌ 无法连接到服务器"
    exit 1
fi

# 2. 检查 Dante 代理状态
echo ""
echo "🔍 步骤 2: 检查 Dante 代理状态..."
SSH_CMD="ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP"

$SSH_CMD "systemctl is-active danted" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Dante 服务正在运行"
else
    echo "⚠️  Dante 服务未运行，正在启动..."
    $SSH_CMD "systemctl start danted"
    sleep 2
    $SSH_CMD "systemctl is-active danted" 2>/dev/null && echo "✅ Dante 已启动" || echo "❌ Dante 启动失败"
fi

# 3. 检查端口监听
echo ""
echo "🔌 步骤 3: 检查端口 1080 监听..."
$SSH_CMD "netstat -tuln | grep 1080" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ 端口 1080 正在监听"
else
    echo "❌ 端口 1080 未监听"
fi

# 4. 重新配置 Dante（修复 SOCKS5 问题）
echo ""
echo "⚙️  步骤 4: 重新配置 Dante 代理..."
cat > /tmp/danted.conf << 'EOF'
logoutput: /var/log/danted.log
user.privileged: root
user.unprivileged: nobody

# 监听所有接口
internal: 0.0.0.0 port = 1080

# 使用主网络接口
external: eth0

# 不需要认证（内网测试用）
clientmethod: none
socksmethod: none

# 允许所有客户端连接
client pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    log: error connect disconnect
}

# 允许所有 SOCKS 操作
socks pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    command: connect bind udpassociate
    log: error connect disconnect
}
EOF

# 上传配置文件
scp /tmp/danted.conf $SERVER_USER@$SERVER_IP:/etc/danted.conf
echo "✅ Dante 配置已更新"

# 重启 Dante
$SSH_CMD "systemctl restart danted"
sleep 2

# 5. 检查防火墙
echo ""
echo "🛡️  步骤 5: 检查防火墙规则..."
$SSH_CMD "ufw status | grep 1080" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  端口 1080 可能未在防火墙中开放，正在添加..."
    $SSH_CMD "ufw allow 1080/tcp" 2>/dev/null || echo "⚠️  ufw 可能未启用"
fi

# 6. 测试代理连通性
echo ""
echo "🧪 步骤 6: 测试代理连通性..."
sleep 3

# 测试 1: 使用本地 SOCKS5
echo "测试 1: 通过代理访问主站..."
RESULT1=$(curl -x socks5h://$SERVER_IP:1080 https://fixr2026.com/ -o /dev/null -s -w "%{http_code}" --max-time 10 2>&1)
if [ "$RESULT1" = "200" ]; then
    echo "✅ 主站访问成功 (HTTP $RESULT1)"
else
    echo "❌ 主站访问失败 (HTTP $RESULT1)"
fi

# 测试 2: 聊天系统
echo "测试 2: 通过代理访问聊天系统..."
RESULT2=$(curl -x socks5h://$SERVER_IP:1080 https://chat.fixturerb2b.top/ -o /dev/null -s -w "%{http_code}" --max-time 10 2>&1)
if [ "$RESULT2" = "200" ]; then
    echo "✅ 聊天系统访问成功 (HTTP $RESULT2)"
else
    echo "❌ 聊天系统访问失败 (HTTP $RESULT2)"
fi

# 7. 创建健康检查脚本
echo ""
echo "📊 步骤 7: 创建健康检查脚本..."
cat > /tmp/proxy-health-check.sh << 'SCRIPT'
#!/bin/bash
# Dante 代理健康检查脚本
# 每5分钟检查一次，失败自动重启

PROXY_HOST="127.0.0.1"
PROXY_PORT="1080"
TEST_URL="https://fixr2026.com/"
LOG_FILE="/var/log/proxy-health-check.log"

check_proxy() {
    # 检查端口是否监听
    if ! netstat -tuln | grep -q ":$PROXY_PORT "; then
        echo "$(date): ❌ 端口 $PROXY_PORT 未监听" >> $LOG_FILE
        systemctl restart danted
        echo "$(date): 🔄 已重启 Dante" >> $LOG_FILE
        return 1
    fi
    
    # 测试代理连通性
    if ! curl -x socks5h://$PROXY_HOST:$PROXY_PORT $TEST_URL -o /dev/null -s --max-time 5 > /dev/null 2>&1; then
        echo "$(date):  代理测试失败" >> $LOG_FILE
        systemctl restart danted
        echo "$(date):  已重启 Dante" >> $LOG_FILE
        return 1
    fi
    
    echo "$(date): ✅ 代理正常" >> $LOG_FILE
    return 0
}

# 执行检查
check_proxy
SCRIPT

# 上传健康检查脚本
scp /tmp/proxy-health-check.sh $SERVER_USER@$SERVER_IP:/usr/local/bin/proxy-health-check.sh
$SSH_CMD "chmod +x /usr/local/bin/proxy-health-check.sh"

# 配置 cron job
$SSH_CMD "echo '*/5 * * * * /usr/local/bin/proxy-health-check.sh' > /etc/cron.d/proxy-health-check"
echo "✅ 健康检查已配置（每5分钟）"

# 8. 生成使用指南
echo ""
echo "=========================================="
echo "✅ 代理修复完成！"
echo "=========================================="
echo ""
echo "📋 代理信息:"
echo "   地址: $SERVER_IP:1080"
echo "   协议: SOCKS5"
echo "   认证: 无需认证"
echo ""
echo "🌐 Chrome 配置步骤:"
echo "   1. 安装 SwitchyOmega 扩展"
echo "   2. 新建情景模式 'Frankfurt Proxy'"
echo "   3. 配置: SOCKS5 / $SERVER_IP / 1080"
echo "   4. 自动切换规则:"
echo "      - *.fixturerb2b.top → Frankfurt Proxy"
echo "      - *.fixr2026.com → Frankfurt Proxy"
echo "      - 默认 → 直接连接"
echo ""
echo "🧪 测试命令:"
echo "   curl -x socks5h://$SERVER_IP:1080 https://chat.fixturerb2b.top/"
echo ""
echo " 健康检查日志:"
echo "   ssh $SERVER_USER@$SERVER_IP 'tail -f /var/log/proxy-health-check.log'"
echo ""
echo "⚠️  注意事项:"
echo "   - 保持终端运行 SSH 命令（方案 A）"
echo "   - 或使用服务器 Dante 代理（方案 B）"
echo ""

# 清理临时文件
rm -f /tmp/danted.conf /tmp/proxy-health-check.sh

echo "=========================================="
