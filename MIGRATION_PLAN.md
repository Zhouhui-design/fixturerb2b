#  项目迁移方案

> 目标：将所有项目从旧服务器迁移到新服务器
> 旧服务器: 139.59.108.156 (DigitalOcean)
> 新服务器: 167.99.134.217 (DigitalOcean)

---

## 🎯 项目清单

### 1. Fixturerb2b 独立站
- **域名**: https://fixr2026.com/ (原 fixturerb2b.top)
- **技术栈**: React + TypeScript + Supabase + Tailwind CSS
- **部署路径**: /var/www/fixr2026.com (待确认)
- **状态**: ✅ 需迁移

### 2. Chat System 聊天系统
- **域名**: https://chat.fixr2026.com/ (原 chat.fixturerb2b.top)
- **技术栈**: Node.js + Express + Socket.IO + MongoDB + PM2
- **部署路径**: /var/www/chat-system/
- **状态**: ✅ 需迁移

### 3. Chinahui B2B 独立站
- **域名**: https://chinahuib2b.top
- **技术栈**: React + TypeScript + Supabase + Tailwind CSS (待确认)
- **部署路径**: 待确认
- **状态**: ✅ 需迁移

---

## 📊 旧服务器状态 (139.59.108.156)

### 已部署项目
1. ✅ Chat System (聊天系统)
   - 路径: /var/www/chat-system/
   - 进程: PM2 管理
   - 数据库: MongoDB (fixturerb2b_chat)
   - 管理员账号: Admin / Admin123

2. ✅ Fixturerb2b 独立站
   - 路径: 待确认 (可能在 /var/www/ 或其他位置)

3. ✅ Chinahui B2B 独立站
   - 路径: 待确认

### 最近修复记录
- ✅ 修复 JavaScript 执行顺序问题 (addDebugLog 函数)
- ✅ 修复 Admin 用户不存在问题
- ✅ 修复 Nginx 缓存配置
- ✅ 优化移动端输入框排版
- ✅ 添加管理员后台 (admin.html)
- ✅ 更新 Service Worker 到 v3
- ✅ 调试面板正常工作
- ✅ 自动连接管理员功能正常

---

## 🚀 迁移计划

### 阶段一：准备工作

#### 1. 新服务器环境配置 (167.99.134.217)
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 安装 MongoDB
apt-get install -y mongodb-org

# 安装 Nginx
apt-get install -y nginx

# 安装 PM2
npm install -g pm2

# 安装 Git
apt-get install -y git

# 安装 Certbot (SSL 证书)
apt-get install -y certbot python3-certbot-nginx
```

#### 2. 创建项目目录
```bash
mkdir -p /var/www/fixr2026.com
mkdir -p /var/www/chat-system
mkdir -p /var/www/chinahuib2b.top
```

---

### 阶段二：迁移 Chat System

#### 1. 备份旧服务器数据
```bash
# 在旧服务器 (139.59.108.156) 执行
ssh root@139.59.108.156

# 备份 MongoDB 数据
mongodump --db fixturerb2b_chat --out /tmp/mongodb-backup

# 打包项目文件
cd /var/www/chat-system
tar -czf /tmp/chat-system-backup.tar.gz --exclude='node_modules' .

# 导出备份文件
exit
scp root@139.59.108.156:/tmp/mongodb-backup.tar.gz /tmp/
scp root@139.59.108.156:/tmp/chat-system-backup.tar.gz /tmp/
```

#### 2. 迁移到新服务器
```bash
# 上传到新服务器 (167.99.134.217)
scp /tmp/chat-system-backup.tar.gz root@167.99.134.217:/tmp/
scp /tmp/mongodb-backup.tar.gz root@167.99.134.217:/tmp/

# 在新服务器执行
ssh root@167.99.134.217

# 解压项目文件
cd /var/www/chat-system
tar -xzf /tmp/chat-system-backup.tar.gz

# 安装依赖
npm install

# 恢复 MongoDB 数据
mongorestore --db fixturerb2b_chat /tmp/mongodb-backup/fixturerb2b_chat

# 启动服务
pm2 start server/server.js --name chat-system
pm2 save
pm2 startup
```

#### 3. 配置 Nginx
```nginx
server {
    listen 80;
    server_name chat.fixr2026.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chat.fixr2026.com;

    ssl_certificate /etc/letsencrypt/live/chat.fixr2026.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chat.fixr2026.com/privkey.pem;

    root /var/www/chat-system/client;
    index index.html;

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # API
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # 静态文件
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 4. 配置 SSL 证书
```bash
certbot --nginx -d chat.fixr2026.com
```

---

### 阶段三：迁移 Fixturerb2b 独立站

#### 1. 从 Git 仓库拉取代码
```bash
cd /var/www/fixr2026.com
git clone [仓库地址] .
npm install
npm run build
```

#### 2. 配置 Nginx
```nginx
server {
    listen 80;
    server_name fixr2026.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fixr2026.com;

    ssl_certificate /etc/letsencrypt/live/fixr2026.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fixr2026.com/privkey.pem;

    root /var/www/fixr2026.com/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. 配置 SSL
```bash
certbot --nginx -d fixr2026.com
```

---

### 阶段四：迁移 Chinahui B2B

#### 1. 迁移代码
```bash
cd /var/www/chinahuib2b.top
# 从 Git 仓库或旧服务器复制文件
npm install
npm run build
```

#### 2. 配置 Nginx
```nginx
server {
    listen 80;
    server_name chinahuib2b.top;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chinahuib2b.top;

    ssl_certificate /etc/letsencrypt/live/chinahuib2b.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chinahuib2b.top/privkey.pem;

    root /var/www/chinahuib2b.top/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 3. 配置 SSL
```bash
certbot --nginx -d chinahuib2b.top
```

---

### 阶段五：测试验证

#### 测试清单
- [ ] fixr2026.com 正常访问
- [ ] chat.fixr2026.com 正常访问
- [ ] chinahuib2b.top 正常访问
- [ ] 聊天系统功能正常
- [ ] 管理员后台正常
- [ ] MongoDB 数据完整
- [ ] SSL 证书有效
- [ ] 移动端适配正常
- [ ] 调试面板显示正常

---

### 阶段六：DNS 切换

#### 修改 DNS 解析
将以下域名的 A 记录指向新服务器：
- fixr2026.com → 167.99.134.217
- chat.fixr2026.com → 167.99.134.217
- chinahuib2b.top → 167.99.134.217

#### TTL 设置
- 切换前: 设置 TTL 为 300 (5 分钟)
- 切换后: 等待 1 小时确认稳定

---

### 阶段七：旧服务器清理

#### 确认新服务器运行正常后
```bash
# 在旧服务器 (139.59.108.156) 执行
pm2 stop all
pm2 delete all

# 停止服务
systemctl stop nginx
systemctl stop mongod

# 删除项目文件 (谨慎操作)
rm -rf /var/www/chat-system
# ... 其他项目
```

---

## ✅ 迁移状态 (2026-05-05 检查)

### 已完成的迁移:
1. ✅ **Chat System** - 完全迁移并运行
   - PM2 进程: chat-system (运行中)
   - MongoDB: 数据库已迁移
   - Nginx: 已配置

2. ✅ **Fixturerb2b 独立站** - 完全迁移并运行
   - 静态文件: /var/www/fixr2026.com/
   - Nginx: 已配置
   - 域名: fixr2026.com

3. ✅ **Chinahui B2B** - 代码已迁移，依赖已安装
   - 代码: /var/www/chinahuib2b/
   - Git: 已关联
   - npm: 依赖已安装
   - PostgreSQL: 数据库存在
   - PM2: chinahuib2b-dev 运行中
   - ⚠️ 需要配置 .env 文件

### 待完成:
- [ ] Chinahui B2B 配置 .env 文件
- [ ] Chinahui B2B Prisma 数据库迁移
- [ ] 所有域名的 SSL 证书配置
- [ ] 域名 DNS 解析更新

---

## 📞 迁移时间估算

- 环境配置: 30 分钟
- Chat System 迁移: 20 分钟
- Fixturerb2b 迁移: 15 分钟
- Chinahui B2B 迁移: 15 分钟
- Nginx + SSL 配置: 30 分钟
- 测试验证: 30 分钟
- DNS 切换: 5-60 分钟 (等待 DNS 传播)

**总计**: 约 2-3 小时

---

## ️ 风险控制

### 迁移前
- ✅ 备份所有数据
- ✅ 确认新服务器可访问
- ✅ 测试 SSH 连接

### 迁移中
- ✅ 逐步迁移，测试一个完成一个
- ✅ 保持旧服务器运行直到确认新服务器正常
- ✅ 记录所有配置更改

### 迁移后
- ✅ 全面测试所有功能
- ✅ 监控服务状态 24 小时
- ✅ 准备回滚方案

---

## 🚀 下一步：完成剩余配置

### 1. 配置 Chinahui B2B 环境变量

```bash
ssh root@167.99.134.217

# 创建 .env 文件
cd /var/www/chinahuib2b
cp .env.local .env

# 编辑 .env 文件，更新生产环境配置
nano .env
```

**需要更新的配置**:
```env
# Database
DATABASE_URL="postgresql://expo_dev:dev123@localhost:5432/global_expo_dev"

# NextAuth
NEXTAUTH_URL="https://chinahuib2b.top"
NEXTAUTH_SECRET="CHANGE_THIS_TO_SECURE_SECRET"

# Chat System
NEXT_PUBLIC_CHAT_API_URL="https://chat.fixturerb2b.top/api"
NEXT_PUBLIC_CHAT_WS_URL="wss://chat.fixturerb2b.top"

# Node Environment
NODE_ENV="production"
PORT="3000"
```

### 2. 运行 Prisma 数据库迁移

```bash
cd /var/www/chinahuib2b

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy

# (可选) 填充初始数据
npm run seed
```

### 3. 重启 Chinahui B2B 服务

```bash
pm2 restart chinahuib2b-dev
pm2 logs chinahuib2b-dev
```

### 4. 配置 SSL 证书

```bash
# 安装 Certbot
apt-get install -y certbot python3-certbot-nginx

# 配置所有域名的 SSL
certbot --nginx -d fixr2026.com -d www.fixr2026.com
certbot --nginx -d chat.fixturerb2b.top
certbot --nginx -d chinahuib2b.top -d www.chinahuib2b.top
```

### 5. 更新 DNS 解析

将以下域名的 A 记录指向: **167.99.134.217**

| 域名 | 当前 IP | 新 IP |
|------|---------|-------|
| fixr2026.com | 139.59.108.156 | 167.99.134.217 |
| chat.fixturerb2b.top | 139.59.108.156 | 167.99.134.217 |
| chinahuib2b.top | 139.59.108.156 | 167.99.134.217 |

### 6. 测试验证

```bash
# 测试所有网站是否可访问
curl -I https://fixr2026.com
curl -I https://chat.fixturerb2b.top
curl -I https://chinahuib2b.top

# 检查 PM2 进程状态
pm2 status

# 检查 Nginx 状态
systemctl status nginx

# 检查数据库状态
systemctl status mongod
systemctl status postgresql
```

---

**最后更新**: 2026-05-05
**状态**: 80% 完成 - 等待完成剩余配置
