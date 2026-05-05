# Cloudflare CDN 配置操作手册 - fixr2026.com

## 📋 当前状态分析

### DNS 配置
- **域名**: fixr2026.com
- **当前 Nameservers**: 
  - ns1.dnsowl.com
  - ns2.dnsowl.com
  - ns3.dnsowl.com
- **DNS 提供商**: DNS Owl
- **服务器 IP**: 167.99.134.217 (DigitalOcean)
- **Cloudflare 状态**: ❌ 未配置

### 网站状态
- ✅ **主站**: https://fixr2026.com (正常运行)
- ✅ **聊天系统**: https://chat.fixturerb2b.top (正常运行)
- ✅ **GA 代码**: G-LWZXF5WGFB (已验证)
- ✅ **SSL 证书**: Let's Encrypt (有效)

---

## 🎯 配置目标

1. **隐藏真实 IP** - 防止 DDoS 攻击和恶意扫描
2. **全球加速** - CDN 节点就近访问，提升速度
3. **安全防护** - WAF、Bot 防护、DDoS 保护
4. **自动 SSL** - Cloudflare Universal SSL
5. **性能优化** - 自动压缩、缓存、图片优化
6. **防止社媒封号** - 通过 CDN 代理访问

---

## 🚀 配置步骤（详细版）

### 步骤 1: 注册/登录 Cloudflare

1. 访问 [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. 使用邮箱注册或使用 Google/GitHub 账号登录
3. 验证邮箱地址

**预计时间**: 2-5 分钟

---

### 步骤 2: 添加站点到 Cloudflare

1. 登录后，点击 **"Add a Site"** 按钮
2. 输入域名: `fixr2026.com`
3. 点击 **"Continue"**

![Add Site](https://dash.cloudflare.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fadd-site.1234567.png&w=800&q=75)

**预计时间**: 1 分钟

---

### 步骤 3: 选择套餐

Cloudflare 会显示可用套餐：

| 套餐 | 价格 | 推荐 |
|------|------|------|
| **Free** | $0/月 | ✅ **推荐开始** |
| Pro | $20/月 | 适合高流量网站 |
| Business | $200/月 | 企业级功能 |
| Enterprise | 联系销售 | 大型企业 |

**选择 Free Plan**，然后点击 **"Continue"**

**预计时间**: 1 分钟

---

### 步骤 4: DNS 记录扫描和配置

Cloudflare 会自动扫描现有 DNS 记录。您需要确保以下记录存在并正确配置：

#### 必需的 DNS 记录

| 类型 | 名称 | 内容 | TTL | 代理状态 | 说明 |
|------|------|------|-----|---------|------|
| A | fixr2026.com | 167.99.134.217 | Auto | 🟠 Proxied | 主站 |
| A | www.fixr2026.com | 167.99.134.217 | Auto | 🟠 Proxied | WWW 重定向 |
| CNAME | chat.fixturerb2b.top | fixr2026.com | Auto | 🟠 Proxied | 聊天系统 |

**重要提示**:
- 🟠 **橙色云 (Proxied)** = 通过 Cloudflare CDN（推荐）
- ⚪ **灰色云 (DNS only)** = 直连服务器（不推荐）

#### 检查步骤

1. 查看 Cloudflare 扫描到的 DNS 记录列表
2. 确认 `fixr2026.com` 的 A 记录指向 `167.99.134.217`
3. 如果没有找到，手动添加：
   - 点击 **"Add record"**
   - Type: `A`
   - Name: `@` (代表 fixr2026.com)
   - IPv4 address: `167.99.134.217`
   - Proxy status: **Proxied** (橙色云)
   - TTL: `Auto`
   - 点击 **"Save"**

4. 同样添加 `www` 记录：
   - Type: `A`
   - Name: `www`
   - IPv4 address: `167.99.134.217`
   - Proxy status: **Proxied**

5. 添加聊天系统子域名（如果需要）：
   - Type: `CNAME`
   - Name: `chat.fixturerb2b`
   - Target: `fixr2026.com`
   - Proxy status: **Proxied**

**预计时间**: 5-10 分钟

---

### 步骤 5: 确认并继续

1. 确认所有 DNS 记录正确
2. 点击 **"Continue"**

---

### 步骤 6: 获取 Cloudflare Nameservers

Cloudflare 会提供两个 Nameservers，例如：

```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

**请复制这两个 NS 地址**，下一步需要用到。

**预计时间**: 1 分钟

---

### 步骤 7: 更新域名 Nameservers（关键步骤）

您需要到 **DNS Owl**（您的域名注册商/DNS 提供商）处更新 NS 记录。

#### DNS Owl 操作步骤

1. **登录 DNS Owl**
   - 访问: https://www.dnsowl.com/
   - 使用您的账号登录

2. **找到域名管理**
   - 在 Dashboard 中找到 `fixr2026.com`
   - 点击 **"Manage"** 或 **"DNS Settings"**

3. **修改 Nameservers**
   - 找到 **"Nameservers"** 或 **"NS Records"** 部分
   - 选择 **"Custom Nameservers"** 或 **"Change Nameservers"**
   - 删除现有的 ns1.dnsowl.com, ns2.dnsowl.com, ns3.dnsowl.com
   - 添加 Cloudflare 提供的两个 NS：
     ```
     alice.ns.cloudflare.com
     bob.ns.cloudflare.com
     ```
   - 保存更改

4. **确认更改**
   - DNS Owl 可能会要求确认
   - 点击确认完成更改

**注意**: 
- 不同注册商界面可能略有不同
- 如果找不到 DNS Owl，请检查您的域名是在哪里注册的（NameSilo、GoDaddy 等）
- 如果在 NameSilo 注册，需要在 NameSilo 控制面板中修改 NS

**预计时间**: 5-15 分钟

---

### 步骤 8: 等待 DNS 传播

DNS 更改需要时间传播到全球 DNS 服务器。

#### 检查传播状态

使用以下工具检查 DNS 传播：

1. **在线工具**:
   - [whatsmydns.net](https://www.whatsmydns.net/#NS/fixr2026.com)
   - [dnschecker.org](https://dnschecker.org/)

2. **命令行检查**:
   ```bash
   # 检查 NS 记录
   dig NS fixr2026.com +short
   
   # 应该看到 Cloudflare 的 NS，例如：
   # alice.ns.cloudflare.com
   # bob.ns.cloudflare.com
   ```

3. **本地检查**:
   ```bash
   # 清除本地 DNS 缓存（macOS）
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   
   # 清除本地 DNS 缓存（Windows）
   ipconfig /flushdns
   
   # 清除本地 DNS 缓存（Linux）
   sudo systemd-resolve --flush-caches
   ```

**传播时间**:
- 最快: 几分钟
- 通常: 1-4 小时
- 最长: 48 小时（很少见）

**预计时间**: 等待 1-4 小时

---

### 步骤 9: 验证 Cloudflare 激活

DNS 传播完成后，验证 Cloudflare 是否生效：

#### 方法 1: 检查 HTTP 响应头

```bash
curl -sI https://fixr2026.com/ | grep -i "cf-ray\|cloudflare\|server:"
```

**预期输出**:
```
cf-ray: 8a1b2c3d4e5f6789-FRA
server: cloudflare
```

如果看到 `server: cloudflare` 和 `cf-ray`，说明 Cloudflare 已激活！✅

#### 方法 2: 使用健康检查脚本

```bash
bash check-health.sh
```

应该看到：
```
4️⃣  Checking Cloudflare CDN status...
   ✅ Using Cloudflare CDN
      cf-ray: xxxxx
      server: cloudflare
```

#### 方法 3: 在线工具

访问 [https://www.cloudflare.com/learning/cdn/how-to-tell-if-a-site-is-using-cloudflare/](https://www.cloudflare.com/learning/cdn/how-to-tell-if-a-site-is-using-cloudflare/)

**预计时间**: 5 分钟

---

### 步骤 10: 配置 Cloudflare 设置

Cloudflare 激活后，建议进行以下优化配置：

#### 10.1 SSL/TLS 设置

1. 进入 Cloudflare Dashboard → **SSL/TLS** 标签
2. 选择加密模式：
   - **Full (strict)** ✅ **推荐**（需要服务器有有效 SSL 证书）
   - Full（如果服务器没有 SSL 证书）
   - Flexible（不推荐，安全性较低）

**您当前的服务器已有 Let's Encrypt 证书，选择 Full (strict)**

#### 10.2 缓存配置

进入 **Caching** → **Configuration**:

- **Caching Level**: Standard
- **Browser Cache TTL**: Respect Existing Headers（尊重源站头）

您的 Nginx 已经配置了合理的缓存头，所以选择"Respect Existing Headers"即可。

#### 10.3 性能优化

进入 **Speed** → **Optimization**:

勾选以下选项：
- ✅ **Auto Minify**: JavaScript, CSS, HTML
- ✅ **Brotli**: 启用（比 Gzip 更好的压缩）
- ✅ **Early Hints**: 启用（可选）
- ⚠️ **Rocket Loader**: 谨慎启用（可能对 React 应用有影响，建议先测试）

#### 10.4 安全设置

进入 **Security** → **Settings**:

- **Security Level**: Medium（平衡安全性和用户体验）
- **Bot Fight Mode**: 启用（免费版可用，阻止恶意机器人）
- **Always Use HTTPS**: 启用（强制 HTTPS）

进入 **SSL/TLS** → **Edge Certificates**:

- ✅ **Always Use HTTPS**: On
- ✅ **Automatic HTTPS Rewrites**: On
- ✅ **HSTS**: 可选（启用前确保所有资源都使用 HTTPS）

#### 10.5 Page Rules（页面规则）

创建以下规则以优化性能：

**规则 1: 静态资源长期缓存**

1. 进入 **Rules** → **Page Rules**
2. 点击 **"Create Page Rule"**
3. URL: `fixr2026.com/assets/*`
4. Settings:
   - **Cache Level**: Cache Everything
   - **Edge Cache TTL**: 1 month
5. 点击 **"Save and Deploy"**

**规则 2: HTML 文件短期缓存**

1. 创建新规则
2. URL: `fixr2026.com/*.html`
3. Settings:
   - **Cache Level**: Cache Everything
   - **Edge Cache TTL**: 2 hours
4. 点击 **"Save and Deploy"**

**规则 3: 强制 WWW 重定向（可选）**

如果您希望所有访问都重定向到 www：

1. 创建新规则
2. URL: `fixr2026.com/*`
3. Settings:
   - **Forwarding URL**: 301 - Permanent Redirect
   - Destination URL: `https://www.fixr2026.com/$1`
4. 点击 **"Save and Deploy"**

**预计时间**: 15-30 分钟

---

### 步骤 11: 获取 Cloudflare API 凭证（用于自动清除缓存）

为了在部署时自动清除 Cloudflare 缓存，需要获取 API Token：

#### 11.1 获取 Zone ID

1. 进入 Cloudflare Dashboard
2. 选择 `fixr2026.com` 站点
3. 在右侧边栏找到 **"Zone ID"**
4. 复制这个 ID（类似: `abc123def456ghi789jkl012mno345pq`）

#### 11.2 创建 API Token

1. 点击右上角头像 → **My Profile**
2. 左侧菜单选择 **API Tokens**
3. 点击 **"Create Token"**
4. 选择模板：**"Edit zone DNS"** 或自定义

**自定义 Token 权限**:

1. Token name: `fixr2026-deploy`
2. Permissions:
   - **Zone** → **Zone Settings** → **Edit**
   - **Zone** → **Cache Purge** → **Purge**
3. Zone Resources:
   - Include → Specific zone → `fixr2026.com`
4. 点击 **"Continue to summary"**
5. 确认权限后点击 **"Create Token"**
6. **立即复制 Token**（只显示一次！）

Token 格式类似: `abcdefghijklmnopqrstuvwxyz123456`

#### 11.3 配置本地环境变量

编辑 `.env` 文件：

```bash
nano .env
```

添加以下内容：

```bash
# Cloudflare CDN Configuration
CF_ZONE_ID=your_zone_id_here
CF_API_TOKEN=your_api_token_here
```

替换为实际的 Zone ID 和 API Token。

**保存并退出**: Ctrl+O, Enter, Ctrl+X

**注意**: `.env` 文件已在 `.gitignore` 中，不会被提交到 Git。

**预计时间**: 10 分钟

---

### 步骤 12: 测试部署和缓存清除

配置完成后，测试部署脚本：

```bash
bash deploy.sh
```

应该看到：

```
[7/7] 执行健康检查和验证...
🔍 验证 GA 代码...
✅ GA 代码验证通过 (G-LWZXF5WGFB)
🔄 清除 Cloudflare 缓存...
✅ Cloudflare 缓存已清除
```

如果看到 "Cloudflare 缓存已清除"，说明配置成功！✅

**预计时间**: 5-10 分钟（部署时间）

---

## 🔧 Nginx 配置优化（可选但推荐）

为了让 Nginx 能够获取真实的客户端 IP（而不是 Cloudflare 的 IP），需要更新 Nginx 配置。

### 在服务器上执行

```bash
# SSH 连接到服务器
ssh root@fixr2026.com

# 备份当前配置
cp /etc/nginx/sites-available/fixr2026.com /etc/nginx/sites-available/fixr2026.com.backup

# 编辑配置
nano /etc/nginx/sites-available/fixr2026.com
```

### 添加 Real IP 配置

在 `server` 块的开头添加：

```nginx
server {
    # Cloudflare Real IP Configuration
    set_real_ip_from on;
    real_ip_header CF-Connecting-IP;
    real_ip_recursive on;
    
    # Trust Cloudflare IP ranges
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
    
    server_name fixr2026.com www.fixr2026.com;
    root /var/www/fixr2026.com;
    index index.html;
    
    # ... 其他配置保持不变 ...
}
```

### 测试并重载 Nginx

```bash
# 测试配置语法
nginx -t

# 如果测试通过，重载 Nginx
systemctl reload nginx

# 查看日志确认无错误
tail -f /var/log/nginx/error.log
```

**预计时间**: 10-15 分钟

---

## 📊 监控和分析

### Cloudflare Analytics

在 Dashboard 中查看：

1. **Analytics & Logs** → **Traffic**
   - 请求数
   - 带宽使用
   - 缓存命中率
   - 威胁拦截

2. **Analytics & Logs** → **Performance**
   - 加载时间
   - 节省的带宽

3. **Security** → **Events**
   - 被阻止的威胁
   - Bot 活动

### 性能测试

部署前后对比：

```bash
# 使用 WebPageTest
# https://www.webpagetest.org/

# 或使用 GTmetrix
# https://gtmetrix.com/

# 命令行测试
curl -w "@curl-format.txt" -o /dev/null -s https://fixr2026.com/
```

**预期改进**:
- 首屏加载时间: ↓ 30-50%
- 总加载时间: ↓ 20-40%
- 带宽使用: ↓ 40-60%（通过缓存和压缩）

---

## ⚠️ 常见问题和故障排除

### 问题 1: DNS 传播很慢

**症状**: 几小时后仍然看不到 Cloudflare 生效

**解决**:
1. 检查是否正确更新了 Nameservers
2. 使用 [whatsmydns.net](https://www.whatsmydns.net/) 检查全球传播状态
3. 清除本地 DNS 缓存
4. 尝试使用不同的网络（移动数据 vs WiFi）
5. 等待最多 48 小时

### 问题 2: 网站无法访问（522 错误）

**症状**: 访问网站显示 "Error 522: Connection timed out"

**原因**: Cloudflare 无法连接到您的源服务器

**解决**:
1. 检查服务器是否运行: `ssh root@fixr2026.com`
2. 检查 Nginx 是否运行: `systemctl status nginx`
3. 检查防火墙是否允许 Cloudflare IP
4. 临时将 DNS 记录改为"灰色云"（DNS only）测试
5. 检查服务器防火墙规则

### 问题 3: SSL 证书错误

**症状**: 浏览器显示 SSL 错误

**解决**:
1. 检查 Cloudflare SSL/TLS 模式是否为 "Full (strict)"
2. 确认服务器 SSL 证书有效: `openssl s_client -connect fixr2026.com:443`
3. 如果证书过期，续期 Let's Encrypt 证书: `certbot renew`
4. 临时切换到 "Full" 模式（非 strict）

### 问题 4: 缓存未更新

**症状**: 部署后看不到更新

**解决**:
1. 手动清除 Cloudflare 缓存:
   - Dashboard → Caching → Configuration → Purge Everything
2. 清除浏览器缓存: Ctrl+F5
3. 检查部署脚本是否正确清除了缓存
4. 使用无痕模式测试

### 问题 5: WebSocket 连接失败

**症状**: 聊天系统的 WebSocket 无法连接

**原因**: Cloudflare Free 计划不支持 WebSocket over CDN

**解决**:
1. 将 `chat.fixturerb2b.top` 的 DNS 记录改为"灰色云"（DNS only）
2. 或者升级到 Enterprise 计划
3. 或者使用其他 WebSocket 解决方案

### 问题 6: API Token 无效

**症状**: 部署时显示 "Cloudflare 缓存清除失败"

**解决**:
1. 检查 Zone ID 是否正确
2. 检查 API Token 是否复制完整
3. 确认 Token 权限包含 "Cache Purge"
4. 重新创建 API Token
5. 检查 `.env` 文件格式是否正确

---

## 📝 配置检查清单

在完成所有步骤后，使用此清单确认：

- [ ] Cloudflare 账户已注册
- [ ] 站点 fixr2026.com 已添加到 Cloudflare
- [ ] DNS 记录已正确配置（A 记录指向 167.99.134.217）
- [ ] 所有记录的代理状态为"橙色云"（Proxied）
- [ ] Nameservers 已更新为 Cloudflare 的 NS
- [ ] DNS 传播已完成（通过 whatsmydns.net 验证）
- [ ] Cloudflare 已激活（curl 显示 server: cloudflare）
- [ ] SSL/TLS 模式设置为 Full (strict)
- [ ] 缓存配置完成
- [ ] 性能优化已启用（Auto Minify, Brotli）
- [ ] 安全设置已配置（Bot Fight Mode, Always Use HTTPS）
- [ ] Page Rules 已创建（可选）
- [ ] Zone ID 已获取
- [ ] API Token 已创建并配置到 .env
- [ ] 部署脚本测试通过
- [ ] Cloudflare 缓存清除成功
- [ ] Nginx Real IP 配置完成（可选）
- [ ] 网站可正常访问（https://fixr2026.com）
- [ ] GA 代码仍正常工作
- [ ] 性能测试显示改进

---

## 🎉 完成后的预期效果

### 性能提升
- ⚡ 全球访问速度提升 30-50%
- ⚡ 首屏加载时间减少 40-60%
- ⚡ 带宽使用减少 40-60%

### 安全增强
- 🔒 真实 IP 被隐藏
- 🔒 DDoS 攻击防护
- 🔒 Web 应用防火墙（WAF）
- 🔒 Bot 防护

### 运维便利
- 📊 详细的分析和日志
- 🔄 自动 SSL 证书管理
- 💾 智能缓存管理
- 🛡️ 自动威胁拦截

---

## 📞 技术支持

如果在配置过程中遇到问题：

1. **Cloudflare 文档**: https://developers.cloudflare.com/
2. **Cloudflare 社区**: https://community.cloudflare.com/
3. **Cloudflare 支持**: https://support.cloudflare.com/
4. **项目文档**: 查看本项目的 CLOUDFLARE_CDN_SETUP.md

---

## 📅 时间估算

| 步骤 | 预计时间 |
|------|---------|
| 注册 Cloudflare | 2-5 分钟 |
| 添加站点 | 1 分钟 |
| 配置 DNS 记录 | 5-10 分钟 |
| 更新 Nameservers | 5-15 分钟 |
| 等待 DNS 传播 | 1-4 小时（大部分时间） |
| 验证激活 | 5 分钟 |
| 配置优化设置 | 15-30 分钟 |
| 获取 API 凭证 | 10 分钟 |
| Nginx 配置（可选） | 10-15 分钟 |
| 测试部署 | 5-10 分钟 |
| **总计** | **约 2-5 小时**（含等待时间） |

**实际动手时间**: 约 1 小时  
**等待时间**: 1-4 小时（DNS 传播）

---

## 🔄 后续维护

### 定期任务

1. **每周**: 运行 `bash check-health.sh` 检查网站状态
2. **每月**: 查看 Cloudflare Analytics，优化配置
3. **每季度**: 审查 Page Rules 和缓存策略
4. **每年**: 续期域名和检查 SSL 证书

### 监控指标

- 缓存命中率（目标: >80%）
- 带宽节省（目标: >40%）
- 威胁拦截数
- 平均响应时间（目标: <1s）

---

**祝您配置顺利！** 🚀

如有任何问题，请参考本文档或联系技术支持。

**最后更新**: 2026-05-05  
**域名**: fixr2026.com  
**服务器**: DigitalOcean (167.99.134.217)
