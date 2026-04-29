#!/bin/bash
# fixturerb2b.top Nginx 快捷运维脚本

SERVER="root@fixturerb2b.top"

case "$1" in
  status)
    echo "🔍 检查Nginx运行状态..."
    ssh $SERVER "systemctl status nginx"
    ;;
  restart)
    echo "🔄 重启Nginx服务..."
    ssh $SERVER "nginx -t && systemctl restart nginx"
    echo "✅ Nginx重启完成"
    ;;
  test)
    echo "🧪 测试Nginx配置文件正确性..."
    ssh $SERVER "nginx -t"
    ;;
  logs)
    if [ "$2" == "access" ]; then
      echo "📋 实时查看访问日志（Ctrl+C退出）..."
      ssh $SERVER "tail -f /var/log/nginx/access.log"
    elif [ "$2" == "error" ]; then
      echo "❌ 实时查看错误日志（Ctrl+C退出）..."
      ssh $SERVER "tail -f /var/log/nginx/error.log"
    else
      echo "用法：./nginx-manage.sh logs [access|error]"
    fi
    ;;
  backup)
    echo "💾 备份Nginx配置文件到本地和服务器..."
    mkdir -p backup/nginx
    scp $SERVER:/etc/nginx/sites-available/fixturerb2b.top backup/nginx/fixturerb2b.top.$(date +%Y%m%d_%H%M%S)
    ssh $SERVER "mkdir -p /root/backup/nginx && cp /etc/nginx/sites-available/fixturerb2b.top /root/backup/nginx/fixturerb2b.top.$(date +%Y%m%d_%H%M%S)"
    echo "✅ 备份完成，本地路径：backup/nginx/"
    ;;
  update)
    echo "🔄 更新服务器系统和Nginx..."
    ssh $SERVER "apt update && apt upgrade -y && nginx -v"
    echo "✅ 更新完成"
    ;;
  healthcheck)
    echo "❤️ 执行网站健康检查..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://fixturerb2b.top)
    if [ "$STATUS" -eq 200 ]; then
      echo "✅ 网站正常，状态码：$STATUS"
    else
      echo "❌ 网站异常，状态码：$STATUS，正在自动重启Nginx..."
      ssh $SERVER "systemctl restart nginx"
      echo "✅ Nginx已重启，请检查网站状态"
    fi
    ;;
  *)
    echo "Nginx 快捷运维脚本"
    echo "用法：./nginx-manage.sh [命令]"
    echo ""
    echo "命令列表："
    echo "  status    查看Nginx运行状态"
    echo "  restart   重启Nginx服务"
    echo "  test      测试Nginx配置正确性"
    echo "  logs      查看日志：./nginx-manage.sh logs [access|error]"
    echo "  backup    备份Nginx配置文件"
    echo "  update    更新服务器系统和Nginx"
    echo "  healthcheck 执行网站健康检查，异常自动重启"
    ;;
esac
