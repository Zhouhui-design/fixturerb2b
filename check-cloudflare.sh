#!/bin/bash

# Cloudflare CDN 配置助手脚本
# 帮助用户完成 Cloudflare CDN 的配置和验证

set -e

DOMAIN="fixr2026.com"
SERVER_IP="167.99.134.217"

echo "🌩️  Cloudflare CDN 配置助手"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查步骤
check_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

success_step() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning_step() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error_step() {
    echo -e "${RED}❌ $1${NC}"
}

info_step() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
check_step "步骤 1: 检查当前 DNS 配置"
echo ""

# 检查当前 Nameservers
echo "当前 Nameservers:"
CURRENT_NS=$(dig NS $DOMAIN +short 2>/dev/null)
if [ -n "$CURRENT_NS" ]; then
    echo "$CURRENT_NS" | while read ns; do
        echo "  - $ns"
    done
    
    if echo "$CURRENT_NS" | grep -q "cloudflare"; then
        success_step "检测到 Cloudflare Nameservers！Cloudflare 可能已配置。"
    else
        warning_step "当前使用的是非 Cloudflare Nameservers"
        echo ""
        info_step "要启用 Cloudflare，您需要："
        echo "  1. 注册 Cloudflare 账户: https://dash.cloudflare.com/sign-up"
        echo "  2. 添加站点: $DOMAIN"
        echo "  3. 在域名注册商处更新 Nameservers 为 Cloudflare 提供的地址"
        echo ""
        info_step "详细步骤请查看: CLOUDFLARE_STEP_BY_STEP.md"
    fi
else
    error_step "无法查询 DNS 记录"
fi

echo ""
echo "----------------------------------------"
echo ""

# 检查网站可访问性
check_step "步骤 2: 检查网站可访问性"
echo ""

HTTP_CODE=$(curl -skL -o /dev/null -w "%{http_code}" https://$DOMAIN/ 2>/dev/null)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ]; then
    success_step "网站可访问 (HTTP $HTTP_CODE)"
else
    error_step "网站返回 HTTP $HTTP_CODE"
fi

echo ""
echo "----------------------------------------"
echo ""

# 检查 GA 代码
check_step "步骤 3: 验证 Google Analytics 代码"
echo ""

GA_ID="G-LWZXF5WGFB"
GA_CHECK=$(curl -skL https://$DOMAIN/ 2>/dev/null | grep -c "$GA_ID")
if [ "$GA_CHECK" -gt 0 ]; then
    success_step "GA 代码已找到: $GA_ID"
else
    error_step "GA 代码未找到: $GA_ID"
fi

echo ""
echo "----------------------------------------"
echo ""

# 检查 Cloudflare 状态
check_step "步骤 4: 检查 Cloudflare CDN 状态"
echo ""

CF_HEADERS=$(curl -sI https://$DOMAIN/ 2>/dev/null | grep -i "cf-ray\|cloudflare\|server:")

if echo "$CF_HEADERS" | grep -qi "cloudflare"; then
    success_step "Cloudflare CDN 已激活！"
    echo ""
    echo "响应头信息:"
    echo "$CF_HEADERS" | sed 's/^/  /'
    
    # 提取 cf-ray
    CF_RAY=$(echo "$CF_HEADERS" | grep -i "cf-ray" | awk '{print $2}')
    if [ -n "$CF_RAY" ]; then
        echo ""
        success_step "Cloudflare Ray ID: $CF_RAY"
    fi
else
    warning_step "Cloudflare CDN 未激活"
    echo ""
    echo "当前服务器信息:"
    SERVER_INFO=$(echo "$CF_HEADERS" | grep -i "server:")
    if [ -n "$SERVER_INFO" ]; then
        echo "  $SERVER_INFO"
    else
        echo "  无法获取服务器信息"
    fi
    echo ""
    info_step "要启用 Cloudflare，请按照 CLOUDFLARE_STEP_BY_STEP.md 中的步骤操作"
fi

echo ""
echo "----------------------------------------"
echo ""

# 检查 SSL 证书
check_step "步骤 5: 检查 SSL 证书"
echo ""

SSL_INFO=$(echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ -n "$SSL_INFO" ]; then
    success_step "SSL 证书有效"
    echo ""
    echo "$SSL_INFO" | while read line; do
        echo "  $line"
    done
else
    warning_step "无法验证 SSL 证书"
fi

echo ""
echo "----------------------------------------"
echo ""

# 检查响应时间
check_step "步骤 6: 测量响应时间"
echo ""

RESPONSE_TIME=$(curl -skL -o /dev/null -w "%{time_total}" https://$DOMAIN/ 2>/dev/null)
if [ -n "$RESPONSE_TIME" ]; then
    echo "响应时间: ${RESPONSE_TIME}s"
    
    # 比较响应时间
    if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l 2>/dev/null || echo "0") )); then
        success_step "响应速度快 (< 1s)"
    elif (( $(echo "$RESPONSE_TIME < 3.0" | bc -l 2>/dev/null || echo "0") )); then
        warning_step "响应速度中等 (1-3s)"
    else
        error_step "响应速度慢 (> 3s)"
    fi
else
    warning_step "无法测量响应时间"
fi

echo ""
echo "========================================"
echo ""

# 总结
echo "📊 总结报告"
echo "========================================"
echo ""
echo "域名: $DOMAIN"
echo "服务器 IP: $SERVER_IP"
echo ""
echo "网站状态: $([ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] && echo "✅ 正常" || echo "❌ 异常")"
echo "GA 代码: $([ $GA_CHECK -gt 0 ] && echo "✅ 已配置" || echo "❌ 未找到")"
echo "Cloudflare: $(echo "$CF_HEADERS" | grep -qi "cloudflare" && echo "✅ 已激活" || echo "❌ 未激活")"
echo "SSL 证书: $([ -n "$SSL_INFO" ] && echo "✅ 有效" || echo "⚠️  未知")"
echo "响应时间: $([ -n "$RESPONSE_TIME" ] && echo "${RESPONSE_TIME}s" || echo "N/A")"
echo ""

# 建议
echo "💡 建议"
echo "========================================"
echo ""

if ! echo "$CF_HEADERS" | grep -qi "cloudflare"; then
    echo "1. 🌩️  启用 Cloudflare CDN 可以提升性能和安全性"
    echo "   - 隐藏真实 IP，防止 DDoS 攻击"
    echo "   - 全球 CDN 加速，提升访问速度"
    echo "   - 自动 SSL/TLS 加密"
    echo "   - Web 应用防火墙（WAF）"
    echo ""
    echo "   详细配置指南: CLOUDFLARE_STEP_BY_STEP.md"
    echo ""
fi

if [ "$GA_CHECK" -eq 0 ]; then
    echo "2. 📊 GA 代码未找到，请检查 index.html"
    echo ""
fi

echo "3. 🔍 定期运行此脚本检查网站状态:"
echo "   bash check-cloudflare.sh"
echo ""

echo "4. 📖 阅读完整文档:"
echo "   - CLOUDFLARE_STEP_BY_STEP.md (详细配置步骤)"
echo "   - CLOUDFLARE_CDN_SETUP.md (技术配置指南)"
echo "   - DEPLOYMENT_SUMMARY.md (部署总结)"
echo ""

echo "========================================"
echo ""
echo "🎉 检查完成！"
echo ""

# 如果 Cloudflare 未激活，显示快速开始指南
if ! echo "$CF_HEADERS" | grep -qi "cloudflare"; then
    echo "🚀 快速开始配置 Cloudflare"
    echo "========================================"
    echo ""
    echo "1. 注册 Cloudflare: https://dash.cloudflare.com/sign-up"
    echo ""
    echo "2. 添加站点: $DOMAIN"
    echo ""
    echo "3. 配置 DNS 记录:"
    echo "   - A record: $DOMAIN → $SERVER_IP (橙色云)"
    echo "   - A record: www.$DOMAIN → $SERVER_IP (橙色云)"
    echo ""
    echo "4. 更新 Nameservers:"
    echo "   - 到您的域名注册商处"
    echo "   - 将 NS 记录改为 Cloudflare 提供的地址"
    echo ""
    echo "5. 等待 DNS 传播（通常 1-4 小时）"
    echo ""
    echo "6. 获取 API 凭证并配置到 .env 文件"
    echo ""
    echo "详细步骤请查看: CLOUDFLARE_STEP_BY_STEP.md"
    echo ""
fi
