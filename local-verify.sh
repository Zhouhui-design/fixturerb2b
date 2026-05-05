#!/bin/bash
# 本地代码和 DNS 验证脚本
# 用途：在无法 SSH 时进行本地验证

echo "=========================================="
echo "📋 本地代码和 DNS 验证"
echo "=========================================="
echo ""

ERRORS=0

# 1. 检查本地构建文件
echo "📦 1. 本地构建文件检查"
echo "----------------------------------------"

if [ -d "dist" ]; then
    echo "✅ dist 目录存在"
    
    # 检查关键文件
    FILES=("index.html" "chat.html" "check-quotes.html")
    for file in "${FILES[@]}"; do
        if [ -f "dist/$file" ]; then
            SIZE=$(du -h "dist/$file" | cut -f1)
            echo "✅ $file 存在 ($SIZE)"
        else
            echo "❌ $file 缺失"
            ERRORS=$((ERRORS + 1))
        fi
    done
    
    # 检查 assets 目录
    if [ -d "dist/assets" ]; then
        echo "✅ assets 目录存在"
        JS_COUNT=$(ls dist/assets/js/*.js 2>/dev/null | wc -l)
        CSS_COUNT=$(ls dist/assets/css/*.css 2>/dev/null | wc -l)
        echo "   JS 文件: $JS_COUNT 个"
        echo "   CSS 文件: $CSS_COUNT 个"
    else
        echo "❌ assets 目录缺失"
        ERRORS=$((ERRORS + 1))
    fi
    
    # 检查 images 目录
    if [ -d "dist/images" ]; then
        IMG_COUNT=$(ls dist/images/*.* 2>/dev/null | wc -l)
        echo "✅ images 目录存在 ($IMG_COUNT 个文件)"
    else
        echo "️  images 目录不存在（可能不需要）"
    fi
else
    echo "❌ dist 目录不存在"
    echo "请先运行: npm run build"
    exit 1
fi

# 2. 检查 HTML 内容
echo ""
echo "📄 2. HTML 内容检查"
echo "----------------------------------------"

# 检查 index.html
if grep -q "FixtureRB2B" dist/index.html; then
    echo "✅ index.html: 标题正确"
else
    echo "❌ index.html: 标题缺失"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "G-LWZXF5WGFB" dist/index.html; then
    echo "✅ index.html: GA 代码存在"
else
    echo "❌ index.html: GA 代码缺失"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "chat.fixturerb2b.top" dist/index.html; then
    echo "✅ index.html: 聊天系统链接存在"
else
    echo "❌ index.html: 聊天系统链接缺失"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "Chat System" dist/index.html; then
    echo "✅ index.html: Chat System 按钮存在"
else
    echo "❌ index.html: Chat System 按钮缺失"
    ERRORS=$((ERRORS + 1))
fi

# 检查 chat.html
if grep -q "<!DOCTYPE" dist/chat.html; then
    echo "✅ chat.html: HTML 文档正常"
else
    echo "❌ chat.html: HTML 文档异常"
    ERRORS=$((ERRORS + 1))
fi

# 3. 检查 JavaScript 文件
echo ""
echo "🔧 3. JavaScript 文件检查"
echo "----------------------------------------"

JS_FILES=$(ls dist/assets/js/*.js 2>/dev/null)
for js_file in $JS_FILES; do
    FILENAME=$(basename "$js_file")
    SIZE=$(du -h "$js_file" | cut -f1)
    echo "✅ $FILENAME ($SIZE)"
done

# 4. 检查 CSS 文件
echo ""
echo "🎨 4. CSS 文件检查"
echo "----------------------------------------"

CSS_FILES=$(ls dist/assets/css/*.css 2>/dev/null)
for css_file in $CSS_FILES; do
    FILENAME=$(basename "$css_file")
    SIZE=$(du -h "$css_file" | cut -f1)
    echo "✅ $FILENAME ($SIZE)"
done

# 5. DNS 解析检查
echo ""
echo "🌐 5. DNS 解析检查"
echo "----------------------------------------"

echo "检查 fixr2026.com..."
MAIN_DNS=$(nslookup fixr2026.com 2>&1 | grep "Address:" | tail -1 | awk '{print $2}')
if [ -n "$MAIN_DNS" ]; then
    echo "✅ fixr2026.com → $MAIN_DNS"
    if [ "$MAIN_DNS" = "167.99.134.217" ]; then
        echo "   ✅ DNS 解析正确"
    else
        echo "   ⚠️  DNS 解析不是预期 IP (167.99.134.217)"
    fi
else
    echo "❌ fixr2026.com DNS 解析失败"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "检查 chat.fixturerb2b.top..."
CHAT_DNS=$(nslookup chat.fixturerb2b.top 2>&1 | grep "Address:" | tail -1 | awk '{print $2}')
if [ -n "$CHAT_DNS" ]; then
    echo "✅ chat.fixturerb2b.top → $CHAT_DNS"
    if [ "$CHAT_DNS" = "167.99.134.217" ]; then
        echo "   ✅ DNS 解析正确"
    else
        echo "   ⚠️  DNS 解析不是预期 IP (167.99.134.217)"
    fi
else
    echo "❌ chat.fixturerb2b.top DNS 解析失败"
    ERRORS=$((ERRORS + 1))
fi

# 6. HTTP 状态检查（如果网络可达）
echo ""
echo "🌍 6. HTTP 状态检查"
echo "----------------------------------------"

echo "测试主站..."
MAIN_STATUS=$(curl -skL --connect-timeout 5 -o /dev/null -w "%{http_code}" https://fixr2026.com/ 2>&1)
if [ "$MAIN_STATUS" = "200" ]; then
    MAIN_TIME=$(curl -skL --connect-timeout 5 -o /dev/null -w "%{time_total}" https://fixr2026.com/ 2>&1)
    echo "✅ 主站: HTTP $MAIN_STATUS (${MAIN_TIME}s)"
elif [ "$MAIN_STATUS" = "000" ]; then
    echo "⚠️  主站: 无法连接（网络问题或服务器离线）"
else
    echo "❌ 主站: HTTP $MAIN_STATUS"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "测试聊天系统..."
CHAT_STATUS=$(curl -skL --connect-timeout 5 -o /dev/null -w "%{http_code}" https://chat.fixturerb2b.top/ 2>&1)
if [ "$CHAT_STATUS" = "200" ]; then
    CHAT_TIME=$(curl -skL --connect-timeout 5 -o /dev/null -w "%{time_total}" https://chat.fixturerb2b.top/ 2>&1)
    echo "✅ 聊天系统: HTTP $CHAT_STATUS (${CHAT_TIME}s)"
elif [ "$CHAT_STATUS" = "000" ]; then
    echo "⚠️  聊天系统: 无法连接（网络问题或服务器离线）"
else
    echo "❌ 聊天系统: HTTP $CHAT_STATUS"
    ERRORS=$((ERRORS + 1))
fi

# 7. 页面内容检查（如果可以访问）
echo ""
echo "📝 7. 页面内容检查"
echo "----------------------------------------"

if [ "$MAIN_STATUS" = "200" ]; then
    MAIN_CONTENT=$(curl -skL https://fixr2026.com/ 2>&1)
    
    # 检查关键功能
    CHECKS=(
        "Products:Products"
        "Cases:Cases"
        "About:About"
        "Contact:Contact"
        "Chat System:Chat System"
    )
    
    for check in "${CHECKS[@]}"; do
        KEY="${check%%:*}"
        TEXT="${check##*:}"
        if echo "$MAIN_CONTENT" | grep -q "$TEXT"; then
            echo "✅ $KEY 链接存在"
        else
            echo "⚠️  $KEY 链接可能缺失"
        fi
    done
else
    echo "⚠️  跳过内容检查（网站无法访问）"
fi

# 8. 文件大小统计
echo ""
echo "📊 8. 文件大小统计"
echo "----------------------------------------"

TOTAL_SIZE=$(du -sh dist/ | cut -f1)
HTML_SIZE=$(du -sh dist/*.html | awk '{sum+=$1} END {print sum}')
ASSETS_SIZE=$(du -sh dist/assets/ | cut -f1)

echo "总大小: $TOTAL_SIZE"
echo "HTML 文件: ${HTML_SIZE:-0}"
echo "Assets: $ASSETS_SIZE"

# 总结
echo ""
echo "=========================================="
echo "📊 验证总结"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "✅ 所有本地检查通过！"
    echo ""
    echo "下一步："
    echo "  1. 等待 SSH 连接恢复"
    echo "  2. 执行部署: bash deploy-and-verify.sh"
    echo "  3. 手动测试: 参考 COMPREHENSIVE_TEST_CHECKLIST.md"
else
    echo "⚠️  发现 $ERRORS 个问题"
    echo ""
    echo "请修复上述标记为 ❌ 的问题"
fi

echo ""
echo "=========================================="
echo "详细报告已保存: LOCAL_VERIFICATION_REPORT.md"
echo "=========================================="

# 生成报告
cat > LOCAL_VERIFICATION_REPORT.md << EOF
# 本地验证报告

**日期**: $(date)

## 本地构建状态
$(if [ $ERRORS -eq 0 ]; then echo "✅ 构建成功"; else echo "⚠️  发现问题"; fi)

## DNS 解析
- fixr2026.com: ${MAIN_DNS:-无法解析}
- chat.fixturerb2b.top: ${CHAT_DNS:-无法解析}

## HTTP 状态
- 主站: HTTP ${MAIN_STATUS:-无法连接}
- 聊天系统: HTTP ${CHAT_STATUS:-无法连接}

## 问题数量
- 总计: $ERRORS 个

## 文件大小
- 总大小: $TOTAL_SIZE
- Assets: $ASSETS_SIZE
EOF
