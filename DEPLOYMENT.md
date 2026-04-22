# DigitalOcean 部署指南 - fixturerb2b.top

## 部署前需要提供的信息

### 1. DigitalOcean 服务器信息
- **Droplet IP地址**: (您需要提供)
- **SSH用户名**: (通常是 root)
- **SSH密钥或密码**: (用于登录服务器)
- **服务器区域**: (如: New York, San Francisco, Singapore等)

### 2. 域名配置
- 域名 `fixturerb2b.top` 已解析到服务器IP ✓
- 需要配置SSL证书（Let's Encrypt免费）

### 3. 后端API（如果有）
- 后端服务地址
- API端点配置

---

## 关于Docker的说明

### 是否需要Docker？

**强烈推荐使用Docker**，原因：

✅ **环境一致性**: Docker确保开发、测试、生产环境完全一致
✅ **依赖隔离**: 避免Node.js版本、npm包版本冲突
✅ **快速部署**: 一键构建和部署
✅ **易于维护**: 更新、回滚非常简单
✅ **资源效率**: 比虚拟机更轻量

**不使用Docker的风险**:
❌ 服务器Node.js版本可能与开发环境不同
❌ npm依赖可能因系统不同而出错
❌ 配置复杂，容易遗漏步骤
❌ 难以复现问题

---

## 部署方案选择

### 方案A: Docker部署（推荐）⭐

#### 优点
- 环境完全一致
- 一键部署
- 易于维护和更新
- 内置Nginx优化

#### 部署步骤

**在您的DigitalOcean服务器上执行:**

```bash
# 1. 连接服务器
ssh root@your_server_ip

# 2. 安装Docker和Docker Compose
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 安装Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. 上传项目文件到服务器
# 在本地执行
scp -r /path/to/fixturerb2b root@your_server_ip:/opt/fixturerb2b

# 或使用Git
git clone your_repo_url /opt/fixturerb2b

# 4. 进入项目目录
cd /opt/fixturerb2b

# 5. 构建并启动
docker-compose up -d --build

# 6. 查看运行状态
docker-compose ps
docker-compose logs -f
```

---

### 方案B: 传统部署（不推荐）

#### 缺点
- 需要手动配置Node.js环境
- 需要手动配置Nginx
- 容易出现环境问题
- 维护复杂

#### 部署步骤

```bash
# 1. 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装Nginx
sudo apt-get update
sudo apt-get install -y nginx

# 3. 上传代码
cd /var/www
git clone your_repo_url fixturerb2b
cd fixturerb2b

# 4. 安装依赖并构建
npm ci
npm run build

# 5. 配置Nginx
sudo cp nginx.conf /etc/nginx/sites-available/fixturerb2b
sudo ln -s /etc/nginx/sites-available/fixturerb2b /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 6. 使用PM2保持进程运行
sudo npm install -g pm2
pm2 start npm --name "fixturerb2b" -- start
pm2 startup
pm2 save
```

---

## SSL证书配置（HTTPS）

### 使用Let's Encrypt（免费）

```bash
# 安装Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d fixturerb2b.top -d www.fixturerb2b.top

# 自动续期测试
sudo certbot renew --dry-run
```

---

## 环境变量配置

### Supabase Configuration (新增)

本项目已集成 Supabase 作为后端服务。需要配置以下环境变量：

创建 `.env.production` 文件:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API URL (如果有其他后端)
VITE_API_URL=https://api.fixturerb2b.top

# Other environment variables
NODE_ENV=production
```

**获取 Supabase 凭证:**
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 Settings > API
4. 复制 Project URL 和 anon/public key

修改 `docker-compose.yml` 添加环境变量:

```yaml
services:
  frontend:
    environment:
      - VITE_SUPABASE_URL=https://your-project-id.supabase.co
      - VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Database Setup

在部署前，需要在 Supabase 中运行数据库迁移：

1. **使用 Supabase Dashboard**:
   - 进入 SQL Editor
   - 复制 `supabase/migrations/001_initial_schema.sql` 的内容
   - 粘贴并运行

2. **或使用 Supabase CLI** (如果已安装):
   ```bash
   supabase link --project-ref your-project-id
   supabase db push
   ```

详见 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 和 [SUPABASE_CLI_SETUP.md](./SUPABASE_CLI_SETUP.md)

---

## 部署后检查清单

- [ ] 网站可以通过 http://fixturerb2b.top 访问
- [ ] HTTPS已配置并正常工作
- [ ] 所有页面路由正常（刷新页面不会出现404）
- [ ] 图片等资源加载正常
- [ ] 语言切换功能正常
- [ ] 移动端响应式正常
- [ ] Lighthouse性能分数 > 90

---

## 常用运维命令

### Docker方式
```bash
# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 更新部署
git pull
docker-compose up -d --build

# 停止服务
docker-compose down

# 查看容器状态
docker-compose ps
```

### 传统方式
```bash
# 查看PM2日志
pm2 logs fixturerb2b

# 重启应用
pm2 restart fixturerb2b

# 更新部署
git pull
npm run build
pm2 restart fixturerb2b
```

---

## 故障排查

### 问题1: 端口被占用
```bash
# 查看占用80端口的进程
sudo lsof -i :80
sudo kill -9 <PID>
```

### 问题2: 权限问题
```bash
sudo chown -R www-data:www-data /var/www/fixturerb2b
sudo chmod -R 755 /var/www/fixturerb2b
```

### 问题3: Nginx配置错误
```bash
sudo nginx -t  # 测试配置
sudo nginx -T  # 查看完整配置
```

---

## 性能优化建议

1. **启用CDN**: 使用Cloudflare加速静态资源
2. **图片优化**: 使用WebP格式，压缩图片
3. **缓存策略**: 已在nginx.conf中配置
4. **Gzip压缩**: 已启用
5. **HTTP/2**: Nginx默认支持

---

## 监控和备份

### 监控
```bash
# 安装监控工具
docker run -d \
  --name=monitoring \
  -p 9090:9090 \
  prom/prometheus
```

### 备份
```bash
# 备份数据卷
docker run --rm \
  -v fixturerb2b_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz -C /data .
```

---

## 需要您提供的信息总结

1. **DigitalOcean Droplet IP地址**
2. **SSH登录凭证**（密钥或密码）
3. **是否有后端API**？如果有，API地址是什么？
4. **是否需要数据库**？（当前项目是纯前端，不需要）
5. **邮箱地址**（用于SSL证书通知）

提供这些信息后，我可以帮您完成自动化部署脚本。
