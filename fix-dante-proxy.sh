#!/bin/bash
# Dante 代理修复脚本 - 基于豆包和 DeepSeek 建议
# 核心修复：添加 resolve: proxy 配置

set -e

SERVER="root@fixr2026.com"

echo "=========================================="
echo "🔧 Dante 代理修复脚本"
echo "=========================================="
echo ""

# 1. 创建修复后的配置
echo " 步骤 1: 创建新的 Dante 配置..."
cat > /tmp/danted-fix.conf << 'CONF'
logoutput: syslog
user.privileged: root
user.unprivileged: nobody
user.libwrap: nobody

# 监听所有网卡的 1080 端口
internal: 0.0.0.0 port = 1080
external: eth0

# 关闭认证（测试用）
clientmethod: none
socksmethod: none

# 允许所有客户端连接
client pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    log: error connect disconnect
}

# 允许 SOCKS5 所有命令，关键补充 resolve 配置
socks pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    command: bind connect udpassociate
    log: error connect disconnect
    # 核心修复：强制在代理服务器端解析 DNS
    resolve: proxy
}

# 补充 UDP 转发
socks pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    command: udpreply
    log: error connect disconnect
}
CONF

echo "✅ 配置文件已创建"

# 2. 上传配置
echo ""
echo "📤 步骤 2: 上传配置到服务器..."
scp /tmp/danted-fix.conf $SERVER:/tmp/danted-fix.conf 2>/dev/null
echo "✅ 配置已上传"

# 3. 在服务器上执行修复
echo ""
echo "🔧 步骤 3: 在服务器上执行修复..."
ssh $SERVER << 'REMOTE_SCRIPT'
#!/bin/bash
set -e

echo "备份原配置..."
cp /etc/danted.conf /etc/danted.conf.backup.$(date +%Y%m%d_%H%M%S)

echo "应用新配置..."
cp /tmp/danted-fix.conf /etc/danted.conf

echo "重启 Dante..."
systemctl restart danted
sleep 2

echo "检查 Dante 状态..."
systemctl status danted | head -10

echo ""
echo "测试代理连通性..."
RESULT=$(curl -x socks5h://127.0.0.1:1080 https://fixr2026.com/ -o /dev/null -s -w "%{http_code}" --max-time 10 2>&1)
if [ "$RESULT" = "200" ]; then
    echo "✅ 代理测试成功！HTTP $RESULT"
else
    echo "️  代理测试失败：HTTP $RESULT"
    echo "查看 Dante 日志："
    journalctl -u danted --no-pager -n 20
fi

# 清理临时文件
rm -f /tmp/danted-fix.conf
REMOTE_SCRIPT

echo ""
echo "=========================================="
echo "✅ 修复完成！"
echo "=========================================="
echo ""
echo "📋 下一步操作："
echo "1. 在 Chrome 中配置 SOCKS5 代理："
echo "   服务器: 167.99.134.217"
echo "   端口: 1080"
echo "2. 测试访问: https://chat.fixturerb2b.top/"
echo ""
echo "🧪 本地测试命令："
echo "curl -x socks5h://167.99.134.217:1080 https://chat.fixturerb2b.top/ -o /dev/null -s -w '%{http_code}\\n'"
echo ""

# 清理本地临时文件
rm -f /tmp/danted-fix.conf
