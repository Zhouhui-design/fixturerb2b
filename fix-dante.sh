#!/bin/bash
# 修复 Dante 代理

# 备份
cp /etc/danted.conf /etc/danted.conf.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# 创建正确的配置
cat > /etc/danted.conf << 'CONF'
logoutput: syslog
user.privileged: root
user.unprivileged: nobody

internal: 0.0.0.0 port = 1080
external: eth0

clientmethod: none
socksmethod: none

client pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    log: error connect disconnect
}

socks pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    command: bind connect udpassociate
    log: error connect disconnect
}
CONF

echo "✅ 配置已更新"

# 重启 Dante
systemctl restart danted
sleep 2

echo "Dante 状态: $(systemctl is-active danted)"

# 测试代理
echo ""
echo "测试代理连通性..."
RESULT=$(curl -x socks5h://127.0.0.1:1080 https://fixr2026.com/ -o /dev/null -s -w "%{http_code}" --max-time 10 2>&1)
echo "HTTP 状态码: $RESULT"

if [ "$RESULT" = "200" ]; then
    echo "✅ 代理测试成功！"
else
    echo " 代理测试失败"
    echo "查看日志："
    journalctl -u danted --no-pager -n 15 | tail -15
fi
