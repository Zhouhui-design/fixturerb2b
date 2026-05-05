# 🚀 FixturerB2B 快速开始指南

## 📋 当前状态

✅ **网站已部署**: https://fixr2026.com  
✅ **GA 代码正常**: G-LWZXF5WGFB  
⏸️ **Cloudflare CDN**: 待配置（可选）

## 🔧 常用命令

### 部署网站
```bash
bash deploy.sh
```

### 健康检查
```bash
bash check-health.sh
```

### 本地开发
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 📚 重要文档

| 文档 | 说明 |
|------|------|
| [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) | 部署完成总结和当前状态 |
| [CLOUDFLARE_CDN_SETUP.md](./CLOUDFLARE_CDN_SETUP.md) | Cloudflare CDN 配置完整指南 |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | 原始部署文档 |

## ⚙️ 环境变量配置

编辑 `.env` 文件（不要提交到 Git）：

```bash
# Supabase 配置（必需）
VITE_SUPABASE_URL=https://yaumblbimxrunltqadsq.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# SaleSmartly 聊天组件（可选）
VITE_SALESMARTLY_PROJECT_ID=g1livqb

# Cloudflare CDN（可选，用于自动清除缓存）
CF_ZONE_ID=your_zone_id
CF_API_TOKEN=your_api_token
```

参考模板: [.env.example](./.env.example)

## 🎯 Cloudflare CDN 配置（推荐）

如果您想启用 Cloudflare CDN 来提升性能和安全性：

### 快速步骤
1. 阅读 [CLOUDFLARE_CDN_SETUP.md](./CLOUDFLARE_CDN_SETUP.md)
2. 注册 Cloudflare 账户
3. 添加 fixr2026.com 站点
4. 更新 DNS Nameservers
5. 在 `.env` 中配置 CF_ZONE_ID 和 CF_API_TOKEN
6. 运行 `bash deploy.sh` 测试

### Cloudflare 的好处
- 🔒 隐藏服务器真实 IP
- ⚡ 全球 CDN 加速
- 🛡️ DDoS 防护和 WAF
- 📈 自动性能优化
- 🌍 防止社媒账号被封

## 📊 监控和维护

### 定期检查
```bash
# 每周运行健康检查
bash check-health.sh

# 查看 GA 数据
# https://analytics.google.com/
```

### 服务器维护
```bash
# SSH 连接到服务器
ssh root@fixr2026.com

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 重启 Nginx
systemctl restart nginx

# 查看磁盘使用
df -h
```

## 🔄 回滚操作

如果部署后出现问题，可以快速回滚：

```bash
ssh root@fixr2026.com 'rm -rf /var/www/fixr2026.com && cp -r /var/www/fixr2026.com_backup_20260505_074000 /var/www/fixr2026.com && systemctl restart nginx'
```

备份位置: `/var/www/fixr2026.com_backup_*`

## 🆘 常见问题

### Q: GA 代码不工作？
A: 运行 `bash check-health.sh` 验证，或检查浏览器控制台是否有错误。

### Q: 部署后看不到更新？
A: 清除浏览器缓存（Ctrl+F5），或等待几分钟让 CDN 缓存过期。

### Q: 如何配置 Cloudflare？
A: 详细步骤请查看 [CLOUDFLARE_CDN_SETUP.md](./CLOUDFLARE_CDN_SETUP.md)

### Q: 网站无法访问？
A: 运行 `bash check-health.sh` 诊断问题，或检查服务器状态。

## 📞 技术支持

- **项目仓库**: GitHub (fixturerb2b)
- **服务器**: DigitalOcean (167.99.134.217)
- **域名**: fixr2026.com
- **数据库**: Supabase

---

**最后更新**: 2026-05-05  
**状态**: ✅ 正常运行
