# Nginx 运维管理手册（fixturerb2b.top）

## 常用命令
### 状态检查
systemctl status nginx
nginx -t  # 测试配置文件正确性

### 服务操作
systemctl restart nginx  # 重启
systemctl stop nginx     # 停止
systemctl start nginx    # 启动
systemctl reload nginx   # 重载配置（不中断服务）

### 日志查看
tail -f /var/log/nginx/access.log  # 实时访问日志
tail -f /var/log/nginx/error.log   # 实时错误日志

## 配置路径
主配置：/etc/nginx/nginx.conf
站点配置：/etc/nginx/sites-available/fixturerb2b.top
网站根目录：/usr/share/nginx/html

## 定期运维任务
1. 每月检查错误日志，清理过期日志
2. 每月执行系统更新：apt update && apt upgrade -y
3. 每月备份Nginx配置文件
4. 每日健康检查，网站挂了自动重启Nginx

## 应急命令
# 快速重启Nginx
ssh root@fixturerb2b.top "systemctl restart nginx"

# 快速回滚网站版本
ssh root@fixturerb2b.top "cp -r /usr/share/nginx/html_backup_<备份时间> /usr/share/nginx/html && systemctl restart nginx"
