#!/bin/bash
# SSH 隧道代理启动脚本
# 用途：在本地创建 SOCKS5 代理，用于访问法兰克福服务器

echo "=========================================="
echo "🚀 SSH 隧道代理启动器"
echo "=========================================="
echo ""
echo "这将在本地 127.0.0.1:1080 创建 SOCKS5 代理"
echo "代理将指向法兰克福服务器 (fixr2026.com)"
echo ""
echo "️  重要提示："
echo "1. 保持这个终端窗口打开，不要关闭"
echo "2. 关闭终端后代理会断开"
echo "3. Chrome 配置为 SOCKS4: 127.0.0.1:1080"
echo "4. 或使用 Firefox 浏览器"
echo ""
echo "按 Ctrl+C 可以停止代理"
echo ""
echo "=========================================="
echo "正在建立 SSH 隧道..."
echo "=========================================="
echo ""

# 启动 SSH 隧道
ssh -D 1080 -C -N -o ServerAliveInterval=60 -o ServerAliveCountMax=3 root@fixr2026.com

# 如果 SSH 断开，会显示
echo ""
echo "️  SSH 隧道已断开"
echo "请重新运行此脚本"
