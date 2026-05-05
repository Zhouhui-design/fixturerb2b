# DNS 配置指南 - chat.fixr2026.com

## 📋 需要做什么

您需要为 `chat.fixr2026.com` 添加一条 DNS 记录，让它指向您的 DigitalOcean 服务器。

## 🎯 服务器信息

- **服务器 IP**：`139.59.108.156`
- **聊天系统端口**：`3000`（通过 Nginx 代理到 80 端口）
- **域名**：`chat.fixr2026.com`

---

## 📝 方案 A：在现有域名注册商添加记录（推荐）

### 步骤 1：登录域名注册商

找到您购买 `fixr2026.com` 的平台：
- Namecheap
- GoDaddy
- 阿里云
- 腾讯云
- Cloudflare
- 或其他域名注册商

### 步骤 2：找到 DNS 管理

在域名管理后台找到：
- DNS 管理
- DNS 解析
- Name Server 管理
- Zone Editor

### 步骤 3：添加 A 记录

添加以下记录：

| 字段 | 值 |
|------|-----|
| **类型（Type）** | A |
| **主机记录（Name/Host）** | chat |
| **记录值（Value/Points to）** | 139.59.108.156 |
| **TTL** | 默认（通常是 3600 或自动） |

**完整域名**：`chat.fixr2026.com`

### 步骤 4：等待生效

DNS 记录通常需要 **5-30 分钟** 生效，最长可能需要 24 小时。

### 步骤 5：验证

```bash
# 在终端运行
ping chat.fixr2026.com

# 或使用在线工具
# https://dnschecker.org/
```

---

## 📝 方案 B：使用 DigitalOcean DNS（可选）

如果您想统一管理所有 DNS 记录：

### 步骤 1：在 DigitalOcean 添加域名

1. 登录 DigitalOcean 控制面板
2. 点击 "Networking" → "Domains"
3. 点击 "Add Domain"
4. 输入 `fixr2026.com`
5. 选择服务器 `139.59.108.156`

### 步骤 2：修改 Name Server

在您的域名注册商处，将 Name Server 改为：

```
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com
```

### 步骤 3：在 DigitalOcean 配置 DNS 记录

在 DigitalOcean DNS 面板添加：

**主站记录**：
```
类型：A
主机：@
指向：139.59.108.156

类型：A
主机：www
指向：139.59.108.156
```

**聊天系统记录**：
```
类型：A
主机：chat
指向：139.59.108.156
```

---

## 🔧 Nginx 配置部署

### 将 Nginx 配置上传到服务器

```bash
# 复制 Nginx 配置
scp nginx.conf root@139.59.108.156:/etc/nginx/sites-available/chat-system

# SSH 到服务器
ssh root@139.59.108.156

# 启用配置
ln -s /etc/nginx/sites-available/chat-system /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

### 或手动部署

在服务器上创建文件 `/etc/nginx/sites-available/chat-system`，内容为：

```nginx
server {
    listen 80;
    server_name chat.fixr2026.com;

    access_log /var/log/nginx/chat-system-access.log;
    error_log /var/log/nginx/chat-system-error.log;

    location / {
        root /usr/share/nginx/html/chat;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## ✅ 验证清单

- [ ] DNS 记录已添加
- [ ] DNS 已生效（ping 通）
- [ ] Nginx 配置已部署
- [ ] Nginx 配置测试通过（`nginx -t`）
- [ ] Nginx 已重启
- [ ] 访问 http://chat.fixr2026.com 可以打开聊天页面
- [ ] 聊天功能正常（发送消息、搜索用户等）

---

## 🔒 SSL 证书（可选）

如果需要 HTTPS，可以使用 Certbot：

```bash
# 安装 Certbot
apt-get install certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d chat.fixr2026.com
```

---

##  常见问题

**Q: DNS 记录添加后不生效？**
A: 等待 5-30 分钟，或使用 DNS 检测工具查看全球生效状态。

**Q: Nginx 启动失败？**
A: 检查配置语法：`nginx -t`，查看错误日志：`cat /var/log/nginx/error.log`

**Q: 聊天系统无法连接？**
A: 检查 PM2 进程：`pm2 status`，查看日志：`pm2 logs chat-system`

---

**创建时间**: 2026-04-23
**服务器 IP**: 139.59.108.156
**域名**: chat.fixr2026.com
