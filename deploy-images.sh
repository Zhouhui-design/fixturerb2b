#!/bin/bash

# 图片优化部署脚本
# 功能: 将WebP优化图片部署到服务器

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$PROJECT_DIR/public/images-webp"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_HOST="${REMOTE_HOST:-your-server-ip}"
REMOTE_PATH="/usr/share/nginx/html/images-webp"

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   WebP 图片部署脚本${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"

# 检查WebP目录是否存在
if [ ! -d "$IMAGES_DIR" ]; then
    echo -e "${RED}✗ 错误: WebP图片目录不存在: $IMAGES_DIR${NC}"
    echo -e "${YELLOW}请先运行: node compress-images.js${NC}"
    exit 1
fi

# 统计文件数量
WEBP_COUNT=$(find "$IMAGES_DIR" -type f -name "*.webp" | wc -l)
TOTAL_SIZE=$(du -sh "$IMAGES_DIR" | cut -f1)

echo -e "${GREEN}✓ 找到 $WEBP_COUNT 个WebP文件${NC}"
echo -e "${GREEN}✓ 总大小: $TOTAL_SIZE${NC}\n"

# 询问是否继续
read -p "是否继续部署到服务器? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}部署已取消${NC}"
    exit 0
fi

echo -e "\n${BLUE}开始部署...${NC}\n"

# 创建远程目录
echo -e "${YELLOW}1. 创建远程目录...${NC}"
ssh ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p $REMOTE_PATH"

# 同步文件(使用rsync)
echo -e "${YELLOW}2. 同步WebP文件到服务器...${NC}"
rsync -avz --progress \
    --delete \
    --exclude='*.jpg' \
    --exclude='*.jpeg' \
    --exclude='*.png' \
    "$IMAGES_DIR/" \
    ${REMOTE_USER}@${REMOTE_HOST}:$REMOTE_PATH/

echo -e "\n${GREEN}✓ 文件同步完成${NC}\n"

# 设置权限
echo -e "${YELLOW}3. 设置文件权限...${NC}"
ssh ${REMOTE_USER}@${REMOTE_HOST} "chmod -R 755 $REMOTE_PATH"

# 重启Nginx(可选)
echo -e "${YELLOW}4. 重新加载Nginx配置...${NC}"
ssh ${REMOTE_USER}@${REMOTE_HOST} "nginx -t && systemctl reload nginx" || {
    echo -e "${YELLOW}提示: Nginx重载失败,请手动检查配置${NC}"
}

echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ 部署成功!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"

echo -e "${GREEN}下一步:${NC}"
echo -e "1. 更新代码中的图片引用,使用OptimizedImage组件"
echo -e "2. 测试网站确保所有图片正常显示"
echo -e "3. 检查浏览器开发者工具确认WebP格式被正确加载"
echo -e "\n${YELLOW}查看部署指南: WEBP_IMAGE_OPTIMIZATION_GUIDE.md${NC}\n"
