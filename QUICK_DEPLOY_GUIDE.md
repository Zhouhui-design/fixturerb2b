#  聊天系统快速部署指南

> 📌 **给 AI 代理的部署说明** - 简明版
> 
> **重要**: 你不需要密码,已配置 SSH 密钥免密登录!

---

## 🎯 核心信息 (必读)

```
服务器 IP: 139.59.108.156
SSH 用户: root (免密登录)
线上路径: /var/www/chat-system/client/
测试地址: https://chat.fixr2026.com/
```

---

## 📦 部署步骤 (3 步完成)

### 步骤 1: 上传文件到服务器

```bash
# 进入本地项目目录
cd /home/sardenesy/projects/chat-system/client

# 上传前端文件 (HTML/CSS/JS)
scp index.html style.css app.js root@139.59.108.156:/var/www/chat-system/client/
```

**说明**:
- `scp` = Secure Copy,用于传输文件
- `root@139.59.108.156` = SSH 连接服务器
- 最后的路径是服务器上的目标目录
- **不需要输入密码**,会自动使用 SSH 密钥

---

### 步骤 2: 更新文件时间戳 (强制刷新浏览器缓存)

```bash
ssh root@139.59.108.156 '
cd /var/www/chat-system/client
timestamp=$(date +%s)
sed -i "s/style.css?v=[0-9]*/style.css?v=$timestamp/" index.html
sed -i "s/app.js?v=[0-9]*/app.js?v=$timestamp/" index.html
echo "✅ 缓存已更新: $timestamp"
'
```

**说明**:
- 这会修改 index.html 中的版本号
- 浏览器会加载最新文件,而不是缓存版本
- 每次部署都必须执行!

---

### 步骤 3: 测试验证

```
打开浏览器,访问: https://chat.fixr2026.com/
使用隐私/无痕模式测试
```

---

##  常用命令速查

### 查看服务器文件
```bash
ssh root@139.59.108.156 'ls -lh /var/www/chat-system/client/'
```

### 重启后端服务 (如果修改了后端代码)
```bash
ssh root@139.59.108.156 'pm2 restart chat-system'
```

### 查看服务状态
```bash
ssh root@139.59.108.156 'pm2 status'
```

### 查看实时日志
```bash
ssh root@139.59.108.156 'pm2 logs chat-system --lines 30'
```

---

## ️ 常见问题

### Q1: SSH 连接需要密码?
```bash
# 不应该需要密码!如果提示密码,检查 SSH 密钥:
ls -la ~/.ssh/

# 应该看到 id_rsa 或 id_ed25519 文件
# 如果没有,需要配置 SSH 密钥
```

### Q2: 部署后页面没变化?
```bash
# 原因: 浏览器缓存了旧文件
# 解决: 执行步骤 2 更新文件时间戳

ssh root@139.59.108.156 '
cd /var/www/chat-system/client
timestamp=$(date +%s)
sed -i "s/style.css?v=[0-9]*/style.css?v=$timestamp/" index.html
sed -i "s/app.js?v=[0-9]*/app.js?v=$timestamp/" index.html
'
```

### Q3: 后端代码修改后没生效?
```bash
# 需要重启 Node.js 服务
ssh root@139.59.108.156 'pm2 restart chat-system'
```

---

##  完整部署检查清单

部署前:
- [ ] 本地文件已修改完成
- [ ] 知道要上传哪些文件

部署中:
- [ ] 使用 SCP 上传文件到服务器
- [ ] 更新文件时间戳
- [ ] (可选)重启后端服务

部署后:
- [ ] 使用隐私模式访问测试
- [ ] 检查所有修改的功能
- [ ] 确认没有报错

---

##  部署示例 (完整流程)

```bash
# 1. 进入项目目录
cd /home/sardenesy/projects/chat-system/client

# 2. 上传文件
scp index.html style.css app.js root@139.59.108.156:/var/www/chat-system/client/

# 输出示例:
# index.html                              100%  15KB  1.2MB/s   00:00
# style.css                               100%  25KB  2.1MB/s   00:00
# app.js                                  100%  45KB  3.5MB/s   00:00

# 3. 更新缓存
ssh root@139.59.108.156 '
cd /var/www/chat-system/client
timestamp=$(date +%s)
sed -i "s/style.css?v=[0-9]*/style.css?v=$timestamp/" index.html
sed -i "s/app.js?v=[0-9]*/app.js?v=$timestamp/" index.html
echo "✅ 缓存已更新: $timestamp"
'

# 4. 验证
ssh root@139.59.108.156 'ls -lh /var/www/chat-system/client/'

# 5. 测试
# 打开浏览器: https://chat.fixr2026.com/
```

---

## 🎯 一键部署命令 (复制粘贴即可)

```bash
cd /home/sardenesy/projects/chat-system/client && \
scp index.html style.css app.js root@139.59.108.156:/var/www/chat-system/client/ && \
ssh root@139.59.108.156 'cd /var/www/chat-system/client && timestamp=$(date +%s) && sed -i "s/style.css?v=[0-9]*/style.css?v=$timestamp/" index.html && sed -i "s/app.js?v=[0-9]*/app.js?v=$timestamp/" index.html && echo "✅ 部署完成: $timestamp"' && \
echo "🎉 部署成功! 访问: https://chat.fixr2026.com/"
```

---

## 📞 技术支持

如果部署遇到问题,检查:

1. **SSH 连接**: `ssh root@139.59.108.156` (应该不需要密码)
2. **服务状态**: `ssh root@139.59.108.156 'pm2 status'`
3. **文件路径**: 确认是 `/var/www/chat-system/client/`
4. **测试地址**: https://chat.fixr2026.com/

---

**记住**: 
- 服务器 IP 是 `139.59.108.156`
- SSH 用户是 `root`
- **不需要密码** (SSH 密钥认证)
- 部署后一定要**更新缓存**和**测试验证**
