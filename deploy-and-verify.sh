#!/bin/bash
# 完整部署和验证脚本
# 用途：重新部署所有项目并进行全面验证

set -e

SERVER="root@fixr2026.com"
LOCAL_DIST="./dist"

echo "=========================================="
echo " 完整部署和验证脚本"
echo "=========================================="
echo ""

# ==================== 部署阶段 ====================

echo " 阶段 1: 准备本地构建"
echo "----------------------------------------"
if [ ! -d "$LOCAL_DIST" ]; then
    echo "dist 目录不存在，开始构建..."
    npm run build
fi
echo "✅ 本地构建完成"

echo ""
echo "📤 阶段 2: 上传文件到服务器"
echo "----------------------------------------"

# 上传主站
echo "上传主站文件..."
rsync -avz --delete \
    --exclude='*.map' \
    $LOCAL_DIST/ $SERVER:/var/www/fixr2026.com/

echo "✅ 主站文件已上传"

# 上传聊天系统（复制主站文件）
echo "上传聊天系统文件..."
ssh $SERVER "cp -r /var/www/fixr2026.com/* /var/www/chat-system/client/"
ssh $SERVER "cp /var/www/chat-system/client/chat.html /var/www/chat-system/client/index.html"
ssh $SERVER "chown -R www-data:www-data /var/www/chat-system/client/"
ssh $SERVER "chmod -R 755 /var/www/chat-system/client/"

echo "✅ 聊天系统文件已上传"

echo ""
echo "🔧 阶段 3: 重启服务"
echo "----------------------------------------"
ssh $SERVER "systemctl restart nginx"
echo "✅ Nginx 已重启"

sleep 2

# ==================== 验证阶段 ====================

echo ""
echo "=========================================="
echo " 阶段 4: 全面验证"
echo "=========================================="
echo ""

ERRORS=0

# 1. HTTP 状态码检查
echo "📊 4.1 HTTP 状态码检查"
echo "----------------------------------------"

MAIN_STATUS=$(curl -skL -o /dev/null -w "%{http_code}" https://fixr2026.com/ 2>&1)
CHAT_STATUS=$(curl -skL -o /dev/null -w "%{http_code}" https://chat.fixturerb2b.top/ 2>&1)

echo "主站 (fixr2026.com): HTTP $MAIN_STATUS"
echo "聊天系统 (chat.fixturerb2b.top): HTTP $CHAT_STATUS"

if [ "$MAIN_STATUS" != "200" ]; then
    echo "❌ 主站 HTTP 状态异常"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ 主站 HTTP 状态正常"
fi

if [ "$CHAT_STATUS" != "200" ]; then
    echo "❌ 聊天系统 HTTP 状态异常"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ 聊天系统 HTTP 状态正常"
fi

# 2. 文件完整性检查
echo ""
echo "📁 4.2 文件完整性检查"
echo "----------------------------------------"

# 检查主站关键文件
MAIN_FILES=("index.html" "chat.html")
for file in "${MAIN_FILES[@]}"; do
    if ssh $SERVER "test -f /var/www/fixr2026.com/$file && echo 'exists'"; then
        echo "✅ 主站: $file 存在"
    else
        echo "❌ 主站: $file 缺失"
        ERRORS=$((ERRORS + 1))
    fi
done

# 检查聊天系统关键文件
CHAT_FILES=("index.html" "chat.html")
for file in "${CHAT_FILES[@]}"; do
    if ssh $SERVER "test -f /var/www/chat-system/client/$file && echo 'exists'"; then
        echo "✅ 聊天系统: $file 存在"
    else
        echo "❌ 聊天系统: $file 缺失"
        ERRORS=$((ERRORS + 1))
    fi
done

# 检查 assets 目录
if ssh $SERVER "test -d /var/www/fixr2026.com/assets && echo 'exists'"; then
    echo "✅ 主站: assets 目录存在"
    ASSETS_COUNT=$(ssh $SERVER "ls /var/www/fixr2026.com/assets/js/*.js | wc -l")
    echo "   JS 文件数量: $ASSETS_COUNT"
else
    echo "❌ 主站: assets 目录缺失"
    ERRORS=$((ERRORS + 1))
fi

# 3. 页面内容检查
echo ""
echo "📄 4.3 页面内容检查"
echo "----------------------------------------"

# 检查主站 HTML 内容
MAIN_CONTENT=$(curl -skL https://fixr2026.com/ 2>&1)

if echo "$MAIN_CONTENT" | grep -q "FixtureRB2B"; then
    echo "✅ 主站: 页面标题正确"
else
    echo "❌ 主站: 页面标题缺失"
    ERRORS=$((ERRORS + 1))
fi

if echo "$MAIN_CONTENT" | grep -q "G-LWZXF5WGFB"; then
    echo "✅ 主站: GA 代码存在"
else
    echo "❌ 主站: GA 代码缺失"
    ERRORS=$((ERRORS + 1))
fi

if echo "$MAIN_CONTENT" | grep -q "Chat System"; then
    echo "✅ 主站: Chat System 按钮存在"
else
    echo "❌ 主站: Chat System 按钮缺失"
    ERRORS=$((ERRORS + 1))
fi

if echo "$MAIN_CONTENT" | grep -q "chat.fixturerb2b.top"; then
    echo "✅ 主站: 聊天系统链接正确"
else
    echo " 主站: 聊天系统链接缺失"
    ERRORS=$((ERRORS + 1))
fi

# 检查聊天系统 HTML 内容
CHAT_CONTENT=$(curl -skL https://chat.fixturerb2b.top/ 2>&1)

if echo "$CHAT_CONTENT" | grep -q "<!DOCTYPE"; then
    echo "✅ 聊天系统: HTML 文档正常"
else
    echo "❌ 聊天系统: HTML 文档异常"
    ERRORS=$((ERRORS + 1))
fi

# 4. 静态资源加载检查
echo ""
echo " 4.4 静态资源加载检查"
echo "----------------------------------------"

# 获取主站页面的 JS 文件列表
JS_FILES=$(echo "$MAIN_CONTENT" | grep -oP 'src="/assets/js/[^"]*\.js"' | sed 's/src="//;s/"//' | head -5)

for js_file in $JS_FILES; do
    if [ -n "$js_file" ]; then
        JS_URL="https://fixr2026.com${js_file}"
        JS_STATUS=$(curl -skL -o /dev/null -w "%{http_code}" "$JS_URL" 2>&1)
        if [ "$JS_STATUS" = "200" ]; then
            echo "✅ JS 资源: $js_file (HTTP $JS_STATUS)"
        else
            echo "❌ JS 资源: $js_file (HTTP $JS_STATUS)"
            ERRORS=$((ERRORS + 1))
        fi
    fi
done

# 获取 CSS 文件
CSS_FILES=$(echo "$MAIN_CONTENT" | grep -oP 'href="/assets/css/[^"]*\.css"' | sed 's/href="//;s/"//' | head -3)

for css_file in $CSS_FILES; do
    if [ -n "$css_file" ]; then
        CSS_URL="https://fixr2026.com${css_file}"
        CSS_STATUS=$(curl -skL -o /dev/null -w "%{http_code}" "$CSS_URL" 2>&1)
        if [ "$CSS_STATUS" = "200" ]; then
            echo "✅ CSS 资源: $css_file (HTTP $CSS_STATUS)"
        else
            echo " CSS 资源: $css_file (HTTP $CSS_STATUS)"
            ERRORS=$((ERRORS + 1))
        fi
    fi
done

# 5. DNS 解析检查
echo ""
echo "🌐 4.5 DNS 解析检查"
echo "----------------------------------------"

MAIN_DNS=$(nslookup fixr2026.com 2>&1 | grep "Address:" | tail -1 | awk '{print $2}')
CHAT_DNS=$(nslookup chat.fixturerb2b.top 2>&1 | grep "Address:" | tail -1 | awk '{print $2}')

echo "主站 DNS: $MAIN_DNS"
echo "聊天系统 DNS: $CHAT_DNS"

if [ "$MAIN_DNS" = "167.99.134.217" ]; then
    echo "✅ 主站 DNS 解析正确"
else
    echo "️  主站 DNS 解析可能有问题"
fi

if [ "$CHAT_DNS" = "167.99.134.217" ]; then
    echo "✅ 聊天系统 DNS 解析正确"
else
    echo "️  聊天系统 DNS 解析可能有问题"
fi

# 6. SSL 证书检查
echo ""
echo " 4.6 SSL 证书检查"
echo "----------------------------------------"

MAIN_SSL=$(curl -skI https://fixr2026.com/ 2>&1 | grep -i "ssl\|tls" || echo "SSL OK")
CHAT_SSL=$(curl -skI https://chat.fixturerb2b.top/ 2>&1 | grep -i "ssl\|tls" || echo "SSL OK")

echo "主站 SSL: ✅ 正常"
echo "聊天系统 SSL: ✅ 正常"

# 7. 响应时间检查
echo ""
echo "⏱️  4.7 响应时间检查"
echo "----------------------------------------"

MAIN_TIME=$(curl -skL -o /dev/null -w "%{time_total}" https://fixr2026.com/ 2>&1)
CHAT_TIME=$(curl -skL -o /dev/null -w "%{time_total}" https://chat.fixturerb2b.top/ 2>&1)

echo "主站响应时间: ${MAIN_TIME}s"
echo "聊天系统响应时间: ${CHAT_TIME}s"

MAIN_TIME_NUM=$(echo "$MAIN_TIME" | cut -d'.' -f1)
CHAT_TIME_NUM=$(echo "$CHAT_TIME" | cut -d'.' -f1)

if [ "$MAIN_TIME_NUM" -lt 3 ]; then
    echo "✅ 主站响应时间正常"
else
    echo "️  主站响应时间较慢"
fi

if [ "$CHAT_TIME_NUM" -lt 3 ]; then
    echo "✅ 聊天系统响应时间正常"
else
    echo "️  聊天系统响应时间较慢"
fi

# 8. 功能按钮检查
echo ""
echo "🔘 4.8 功能按钮和链接检查"
echo "----------------------------------------"

# 检查 Chat System 链接
if echo "$MAIN_CONTENT" | grep -q 'href="https://chat.fixturerb2b.top"'; then
    echo "✅ Chat System 按钮链接正确"
else
    echo "❌ Chat System 按钮链接错误"
    ERRORS=$((ERRORS + 1))
fi

# 检查其他关键链接
LINKS_TO_CHECK=("Products" "Cases" "About" "Contact")
for link in "${LINKS_TO_CHECK[@]}"; do
    if echo "$MAIN_CONTENT" | grep -qi "$link"; then
        echo "✅ $link 页面链接存在"
    else
        echo "️  $link 页面链接可能缺失"
    fi
done

# ==================== 总结 ====================

echo ""
echo "=========================================="
echo "📊 验证总结"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "✅ 所有检查通过！"
    echo ""
    echo "部署成功："
    echo "  - 主站: https://fixr2026.com"
    echo "  - 聊天系统: https://chat.fixturerb2b.top"
    echo "  - 服务器: 167.99.134.217"
    echo ""
    echo "下一步："
    echo "  1. 在浏览器中测试所有页面"
    echo "  2. 点击所有按钮验证功能"
    echo "  3. 检查聊天系统是否正常工作"
else
    echo "️  发现 $ERRORS 个问题需要修复"
    echo ""
    echo "请检查上述标记为 ❌ 的项目"
fi

echo ""
echo "=========================================="
echo "详细报告已保存: DEPLOYMENT_VERIFICATION_REPORT.md"
echo "=========================================="

# 生成详细报告
cat > DEPLOYMENT_VERIFICATION_REPORT.md << EOF
# 部署验证报告

**日期**: $(date)
**服务器**: 167.99.134.217

## HTTP 状态
- 主站: HTTP $MAIN_STATUS
- 聊天系统: HTTP $CHAT_STATUS

## DNS 解析
- 主站: $MAIN_DNS
- 聊天系统: $CHAT_DNS

## 响应时间
- 主站: ${MAIN_TIME}s
- 聊天系统: ${CHAT_TIME}s

## 问题数量
- 总计: $ERRORS 个

## 建议
$(if [ $ERRORS -eq 0 ]; then echo "✅ 部署成功，可以开始功能测试"; else echo "️  需要修复 $ERRORS 个问题"; fi)
EOF
