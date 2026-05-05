# Cloudflare CDN 配置指南 - fixr2026.com

## 📋 当前状态

- ✅ **网站已部署**: https://fixr2026.com
- ✅ **GA 代码已验证**: G-LWZXF5WGFB 正常工作
- ❌ **Cloudflare CDN**: 尚未配置（当前直接连接到 DigitalOcean 服务器）
- 📍 **服务器 IP**: 167.99.134.217 (DigitalOcean)

## 🎯 为什么要使用 Cloudflare CDN？

根据您的项目需求：

1. **隐藏真实 IP** - 防止 DDoS 攻击和恶意扫描
2. **提升访问速度** - 全球 CDN 节点加速
3. **SSL/TLS 加密** - 自动 HTTPS 证书管理
4. **安全防护** - WAF、DDoS 保护
5. **防止社媒封号** - 通过 CDN 代理访问，避免直接暴露服务器 IP

## 🚀 配置步骤

### 步骤 1: 注册/登录 Cloudflare

1. 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. 注册账号或使用现有账号登录

### 步骤 2: 添加站点

1. 点击 **"Add a Site"**
2. 输入域名: `fixr2026.com`
3. 选择 **Free Plan**（免费套餐已足够）
4. 点击 **"Continue"**

### 步骤 3: 扫描 DNS 记录

Cloudflare 会自动扫描现有 DNS 记录。确保以下记录存在：

| 类型 | 名称 | 内容 | 代理状态 |
|------|------|------|---------|
| A | fixr2026.com | 167.99.134.217 | 🟠 Proxied (橙色云) |
| A | www.fixr2026.com | 167.99.134.217 | 🟠 Proxied (橙色云) |
| CNAME | chat.fixturerb2b.top | 167.99.134.217 | 🟠 Proxied (可选) |

**重要**: 
- 确保 `fixr2026.com` 和 `www.fixr2026.com` 的云朵是**橙色**（Proxied）
- 橙色 = 通过 Cloudflare CDN
- 灰色 = 直连服务器（不推荐）

### 步骤 4: 更新域名服务器 (Nameservers)

Cloudflare 会提供两个 Nameservers，例如：
```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

**您需要到您的域名注册商处更新 NS 记录：**

如果您的域名在 **NameSilo**（根据记忆）：
1. 登录 NameSilo 账户
2. 找到 `fixr2026.com` 域名
3. 点击 **"Manage Domain"**
4. 找到 **"Nameservers"** 部分
5. 选择 **"Custom Nameservers"**
6. 输入 Cloudflare 提供的两个 NS 地址
7. 保存更改

⏱️ **DNS 传播时间**: 通常需要几分钟到 48 小时，但大多数情况下在 1 小时内完成。

### 步骤 5: 验证 Cloudflare 激活

等待 DNS 传播后，运行以下命令验证：

```bash
# 检查是否通过 Cloudflare
curl -sI https://fixr2026.com/ | grep -i "cf-ray\|cloudflare"

# 应该看到类似输出：
# cf-ray: 8a1b2c3d4e5f6789-FRA
# server: cloudflare
```

或者访问: [https://www.whatsmydns.net/#A/fixr2026.com](https://www.whatsmydns.net/#A/fixr2026.com)

## ⚙️ Cloudflare 优化配置

### 1. SSL/TLS 设置

在 Cloudflare Dashboard 中：
1. 进入 **SSL/TLS** 标签
2. 选择 **"Full (strict)"** 模式
   - 这需要您的服务器有有效的 SSL 证书（您已经有 Let's Encrypt 证书）

### 2. 缓存配置

进入 **Caching** → **Configuration**:
- **Caching Level**: Standard
- **Browser Cache TTL**: 尊重源站头（您的 Nginx 已配置了合理的缓存头）

### 3. 性能优化

进入 **Speed** → **Optimization**:
- ✅ Auto Minify: 勾选 JavaScript, CSS, HTML
- ✅ Brotli: 启用
- ✅ Rocket Loader: 可选（对 React 应用可能有帮助）

### 4. 安全设置

进入 **Security** → **Settings**:
- **Security Level**: Medium（平衡安全性和用户体验）
- **Bot Fight Mode**: 启用（免费版可用）

### 5. Page Rules（页面规则）

创建以下规则以优化性能：

**规则 1: 静态资源长期缓存**
- URL: `fixr2026.com/assets/*`
- Settings: 
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month

**规则 2: HTML 文件短期缓存**
- URL: `fixr2026.com/*.html`
- Settings:
  - Cache Level: Cache Everything  
  - Edge Cache TTL: 2 hours

## 🔧 服务器端调整

由于启用了 Cloudflare，建议调整 Nginx 配置以获取真实客户端 IP：

### 更新 Nginx 配置

在服务器上执行：

```bash
ssh root@fixr2026.com

# 编辑 Nginx 配置
nano /etc/nginx/sites-available/fixr2026.com
```

在 `server` 块中添加：

```nginx
# Cloudflare Real IP Configuration
set_real_ip_from on;
real_ip_header CF-Connecting-IP;
real_ip_recursive on;

# Cloudflare IP Ranges (用于信任代理)
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
```

然后重启 Nginx：

```bash
systemctl reload nginx
```

## 📊 监控和分析

### Cloudflare Analytics

在 Dashboard 中查看：
- **Analytics & Logs** → **Traffic**
- 查看带宽节省、请求数、威胁拦截等

### 性能测试

部署前后对比：

```bash
# 使用 WebPageTest 或 GTmetrix 测试
# https://www.webpagetest.org/
# https://gtmetrix.com/

# 或使用命令行
curl -w "@curl-format.txt" -o /dev/null -s https://fixr2026.com/
```

## ⚠️ 注意事项

### 1. SSL 证书

- Cloudflare 提供免费的 Universal SSL
- 但建议保持服务器端的 Let's Encrypt 证书（Full strict 模式需要）

### 2. WebSocket 支持

如果您使用 WebSocket（如聊天系统），需要在 Cloudflare 中：
- Enterprise 计划才支持 WebSocket over CDN
- 或者使用灰色云（DNS only）绕过 CDN

### 3. 缓存清除

当更新网站后，需要清除 Cloudflare 缓存：
1. Dashboard → **Caching** → **Configuration**
2. 点击 **"Purge Everything"**
3. 或使用 API: `curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" -H "Authorization: Bearer {token}" -H "Content-Type: application/json" --data '{"purge_everything":true}'`

### 4. 开发环境

- 本地开发时不需要 Cloudflare
- 可以使用 `hosts` 文件临时指向服务器 IP 进行测试

## 🎉 完成检查清单

- [ ] Cloudflare 账户已注册
- [ ] 站点已添加到 Cloudflare
- [ ] DNS 记录已正确配置（橙色云）
- [ ] 域名 NS 已更新到 Cloudflare
- [ ] DNS 传播完成（可通过 whatsmydns.net 验证）
- [ ] SSL/TLS 设置为 Full (strict)
- [ ] 缓存和优化配置完成
- [ ] Nginx 已配置 Real IP
- [ ] 网站可正常访问（https://fixr2026.com）
- [ ] GA 代码仍正常工作
- [ ] 性能测试显示改进

## 📞 故障排除

### 问题 1: 网站无法访问

**检查**:
```bash
dig fixr2026.com @1.1.1.1
curl -I https://fixr2026.com
```

**解决**: 等待 DNS 传播，或检查 Cloudflare DNS 设置

### 问题 2: SSL 错误

**检查**: Cloudflare SSL/TLS 模式是否为 Full (strict)

**解决**: 
- 确保服务器 SSL 证书有效
- 或临时切换到 Full 模式（非 strict）

### 问题 3: 缓存未更新

**解决**: 
```bash
# 清除 Cloudflare 缓存
# Dashboard → Caching → Purge Everything

# 或在部署脚本中添加
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

## 🔄 自动化部署集成

可以在 `deploy.sh` 中添加 Cloudflare 缓存清除：

```bash
# 在 deploy.sh 末尾添加

# 清除 Cloudflare 缓存
echo "[7/7] 清除 Cloudflare 缓存..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}' > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Cloudflare 缓存已清除"
else
  echo "⚠️ Cloudflare 缓存清除失败，请手动清除"
fi
```

需要在 `.env` 中添加：
```bash
CF_ZONE_ID=your_zone_id
CF_API_TOKEN=your_api_token
```

## 📚 相关资源

- [Cloudflare 文档](https://developers.cloudflare.com/)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [DNS 传播检查](https://www.whatsmydns.net/)
- [性能测试工具](https://pagespeed.web.dev/)

---

**最后更新**: 2026-05-05
**网站**: https://fixr2026.com
**服务器**: DigitalOcean (167.99.134.217)
