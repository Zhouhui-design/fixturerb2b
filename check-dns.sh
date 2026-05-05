#!/bin/bash

echo "=================================================================="
echo "🔍 检查 chat.fixr2026.com DNS 解析状态"
echo "=================================================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 测试多个 DNS 服务器
echo "📡 正在测试不同 DNS 服务器的解析结果..."
echo ""

DNS_SERVERS=("8.8.8.8" "1.1.1.1" "223.5.5.5")

for dns in "${DNS_SERVERS[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "DNS 服务器: $dns"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    RESULT=$(nslookup chat.fixr2026.com $dns 2>&1)
    echo "$RESULT"
    
    if echo "$RESULT" | grep -q "167.99.134.217"; then
        echo -e "\n✅ 成功！DNS 已生效，解析到 167.99.134.217"
        echo ""
        echo "=================================================================="
        echo "🎉 DNS 解析成功！现在可以运行配置脚本了："
        echo ""
        echo "   bash setup-chat-domain.sh"
        echo ""
        echo "=================================================================="
        exit 0
    fi
    
    if echo "$RESULT" | grep -q "NXDOMAIN"; then
        echo -e "\n${YELLOW}⚠️  该 DNS 服务器尚未生效${NC}"
    fi
    
    echo ""
done

echo "=================================================================="
echo "❌ DNS 尚未生效，所有 DNS 服务器都返回 NXDOMAIN"
echo ""
echo "请等待 1-5 分钟后再试"
echo ""
echo " 提示："
echo "   - Cloudflare DNS 通常在 1-5 分钟内生效"
echo "   - 如果已经等待超过 10 分钟，请检查 Cloudflare 配置"
echo ""
echo "=================================================================="

exit 1
