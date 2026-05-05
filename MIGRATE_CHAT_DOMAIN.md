# 聊天系统域名迁移方案

**日期**: 2026-05-05  
**目标**: 将聊天系统从 `chat.fixturerb2b.top` 迁移到 `chat.fixr2026.com`  
**原因**: 
- `fixturerb2b.top` 域名未解析到新服务器
- 计划废弃所有 `.top` 域名
- 统一使用 `.com` 域名

---

## 📋 实施步骤

### 步骤 1: 添加 DNS 记录（在 DNS Owl）

登录 [DNS Owl](https://www.dnspod.cn/)，为 `fixr2026.com` 添加 A 记录：

```
类型: A
主机记录: chat
记录值: 167.99.134.217
TTL: 600 (10分钟)
```

**验证 DNS 解析**（等待 5-10 分钟后）：
```bash
nslookup chat.fixr2026.com
# 应该返回: 167.99.134.217
```

---

### 步骤 2: 更新代码中的聊天系统链接

修改文件: `src/config/site.ts`

**之前**:
```typescript
chatSystem: 'https://chat.fixturerb2b.top',
```

**之后**:
```typescript
chatSystem: 'https://chat.fixr2026.com',
```

---

### 步骤 3: 重新构建项目

```bash
npm run build
```

---

### 步骤 4: 部署到服务器

```bash
# 上传新构建的文件
rsync -avz --delete dist/ root@167.99.134.217:/var/www/fixr2026.com/

# 重启 Nginx（如果需要）
ssh root@167.99.134.217 "systemctl reload nginx"
```

---

### 步骤 5: 配置 Nginx for chat.fixr2026.com

在服务器上创建新的 Nginx 配置文件：

```bash
ssh root@167.99.134.217

# 复制并修改现有的聊天系统配置
cp /etc/nginx/sites-available/chat.fixturerb2b.top /etc/nginx/sites-available/chat.fixr2026.com

# 编辑配置文件
nano /etc/nginx/sites-available/chat.fixr2026.com
```

**修改内容**:
```nginx
server {
    listen 80;
    server_name chat.fixr2026.com;  # 改为新域名
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chat.fixr2026.com;  # 改为新域名

    ssl_certificate /etc/letsencrypt/live/chat.fixr2026.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chat.fixr2026.com/privkey.pem;
    
    # ... 其他配置保持不变
}
```

---

### 步骤 6: 申请 SSL 证书

```bash
ssh root@167.99.134.217

# 使用 Certbot 申请新域名的 SSL 证书
certbot --nginx -d chat.fixr2026.com

# 或者手动申请
certbot certonly --nginx -d chat.fixr2026.com
```

---

### 步骤 7: 启用新配置

```bash
ssh root@167.99.134.217

# 创建符号链接
ln -s /etc/nginx/sites-available/chat.fixr2026.com /etc/nginx/sites-enabled/

# 删除旧配置（可选，建议先保留一段时间）
rm /etc/nginx/sites-enabled/chat.fixturerb2b.top

# 测试配置
nginx -t

# 重新加载 Nginx
systemctl reload nginx
```

---

### 步骤 8: 验证

```bash
# 测试 DNS 解析
nslookup chat.fixr2026.com

# 测试 HTTP 访问
curl -skL https://chat.fixr2026.com/ -o /dev/null -w "HTTP %{http_code}\n"

# 在浏览器中访问
# https://chat.fixr2026.com/
```

---

## 🔄 过渡期策略

### 第 1 周：双域名并行
- 保留 `chat.fixturerb2b.top` 配置
- 同时启用 `chat.fixr2026.com`
- 代码中使用新域名

### 第 2-4 周：监控和观察
- 检查是否有用户仍在使用旧域名
- 查看 Nginx 访问日志
- 确认新域名工作正常

### 1 个月后：停用旧域名
- 删除 `chat.fixturerb2b.top` 的 Nginx 配置
- 在 DNS Owl 中删除该子域名记录
- 设置 301 重定向（可选）

---

## ⚠️ 注意事项

### 1. DNS 传播时间
- DNS 记录更新可能需要 5-30 分钟生效
- 全球完全传播可能需要 24-48 小时
- 建议使用 `dig` 或 `nslookup` 多次检查

### 2. SSL 证书
- 新域名需要单独的 SSL 证书
- 可以使用 Let's Encrypt 免费申请
- 确保证书自动续期

### 3. 浏览器缓存
- 用户浏览器可能缓存了旧域名
- 建议在过渡期保留旧域名配置
- 可以通过 Service Worker 控制缓存

### 4. 外部链接
- 检查是否有其他地方引用了旧域名
- 更新文档、邮件签名等
- 社交媒体链接

---

## 📊 验证清单

- [ ] DNS 记录已添加
- [ ] DNS 解析正常（返回 167.99.134.217）
- [ ] 代码已更新为新域名
- [ ] 项目已重新构建
- [ ] 文件已部署到服务器
- [ ] Nginx 配置已创建
- [ ] SSL 证书已申请
- [ ] Nginx 配置已启用
- [ ] HTTP 访问测试通过（HTTP 200）
- [ ] HTTPS 访问测试通过
- [ ] Chat System 按钮跳转正常
- [ ] 聊天功能正常工作

---

## 🚀 快速执行脚本

创建一个自动化脚本来执行上述步骤：

```bash
#!/bin/bash
# migrate-chat-domain.sh

SERVER="root@167.99.134.217"
OLD_DOMAIN="chat.fixturerb2b.top"
NEW_DOMAIN="chat.fixr2026.com"

echo "开始迁移聊天系统域名..."

# 1. 更新代码
sed -i "s|$OLD_DOMAIN|$NEW_DOMAIN|g" src/config/site.ts
echo "✅ 代码已更新"

# 2. 重新构建
npm run build
echo "✅ 项目已构建"

# 3. 部署
rsync -avz --delete dist/ $SERVER:/var/www/fixr2026.com/
echo "✅ 文件已部署"

# 4. 配置 Nginx（需要在服务器上执行）
ssh $SERVER << EOF
# 复制配置
cp /etc/nginx/sites-available/$OLD_DOMAIN /etc/nginx/sites-available/$NEW_DOMAIN
sed -i "s|$OLD_DOMAIN|$NEW_DOMAIN|g" /etc/nginx/sites-available/$NEW_DOMAIN

# 创建符号链接
ln -s /etc/nginx/sites-available/$NEW_DOMAIN /etc/nginx/sites-enabled/

# 申请 SSL 证书
certbot --nginx -d $NEW_DOMAIN --non-interactive --agree-tos --email sardenesy@gmail.com

# 测试并重载
nginx -t && systemctl reload nginx
EOF

echo "✅ Nginx 配置已完成"
echo ""
echo "请在 DNS Owl 中添加 A 记录："
echo "  主机记录: chat"
echo "  记录值: 167.99.134.217"
echo ""
echo "等待 5-10 分钟后测试访问："
echo "  https://$NEW_DOMAIN/"
```

---

## 💡 备选方案

如果不想使用子域名，可以考虑：

### 方案 B：集成到主站路径

**优点**:
- 不需要额外的 DNS 记录
- 不需要额外的 SSL 证书
- 更简单的架构

**缺点**:
- 聊天系统和主站耦合
- 无法独立扩展
- URL 不够清晰

**实施**:
1. 将聊天系统前端文件放到 `/var/www/fixr2026.com/chat/`
2. Nginx 配置中添加 `/chat/` 路径代理
3. 更新代码中的链接为 `https://fixr2026.com/chat/`

---

## 🎯 推荐

**强烈推荐使用方案 A（chat.fixr2026.com）**，因为：
1. ✅ 保持架构清晰
2. ✅ 易于维护和扩展
3. ✅ 符合最佳实践
4. ✅ 只需要添加一条 DNS 记录

---

**下一步**: 
1. 在 DNS Owl 中添加 A 记录
2. 告诉我是否完成，我会帮您执行后续步骤
