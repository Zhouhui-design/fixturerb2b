# 聊天系统线上部署指南

> 📌 **重要**: 请将此文档提供给 AI 代理(Agent),用于指导部署操作
> 
> 目标域名: https://chat.fixr2026.com/
> 项目路径: /home/sardenesy/projects/chat-system/

---

## 🔑 服务器信息 (部署前必读)

### 服务器详情
```
服务器 IP: 139.59.108.156
操作系统: Ubuntu 24.04
SSH 用户: root
SSH 端口: 22
项目目录: /var/www/chat-system/
```

### ⚠️ 重要说明
1. **不需要密码** - 使用 SSH 密钥认证,已配置免密登录
2. **使用 root 用户** - 直接以 root 身份操作
3. **本地代码路径**: `/home/sardenesy/projects/chat-system/`
4. **线上代码路径**: `/var/www/chat-system/`

---

## 📦 部署方式 (选择一种)

### 方式一: 使用 SCP 命令 (推荐)

**适用场景**: 修改了前端文件 (HTML/CSS/JS)

```bash
# 1. 进入本地项目目录
cd /home/sardenesy/projects/chat-system/client

# 2. 上传前端文件到服务器
scp index.html style.css app.js root@139.59.108.156:/var/www/chat-system/client/

# 3. 验证文件已上传
ssh root@139.59.108.156 'ls -lh /var/www/chat-system/client/'
```

**注意事项**:
- 确保本地文件已修改完成
- SCP 会自动覆盖服务器上的旧文件
- 文件路径使用绝对路径更安全

---

### 方式二: 完整项目部署

**适用场景**: 修改了后端代码或需要部署整个项目

```bash
# 1. 打包本地项目
cd /home/sardenesy/projects/chat-system
tar -czf chat-system.tar.gz --exclude='node_modules' --exclude='.git' .

# 2. 上传到服务器
scp chat-system.tar.gz root@139.59.108.156:/tmp/

# 3. SSH 登录服务器并解压
ssh root@139.59.108.156
cd /var/www/
tar -xzf /tmp/chat-system.tar.gz
rm /tmp/chat-system.tar.gz

# 4. 安装依赖并重启服务
cd /var/www/chat-system
npm install
pm2 restart chat-system
exit
```

---

### 方式三: Git 部署 (如果配置了 Git)

**适用场景**: 项目已提交到 Git 仓库

```bash
# 在服务器上执行
ssh root@139.59.108.156
cd /var/www/chat-system
git pull origin main
npm install
pm2 restart chat-system
exit
```

---

## 🚀 完整部署流程 (标准步骤)

### 步骤 1: 准备本地文件
```bash
# 确认修改的文件
cd /home/sardenesy/projects/chat-system/client
git status  # 如果使用 Git
ls -lh     # 查看文件
```

### 步骤 2: 上传文件到服务器
```bash
# 上传所有前端文件
scp index.html style.css app.js root@139.59.108.156:/var/www/chat-system/client/
```

### 步骤 3: 验证部署
```bash
# 检查文件时间戳
ssh root@139.59.108.156 'ls -lh /var/www/chat-system/client/'
```

### 步骤 4: 清除浏览器缓存
在 index.html 中更新文件时间戳:
```bash
# 在服务器上执行
ssh root@139.59.108.156 '
cd /var/www/chat-system/client
timestamp=$(date +%s)
sed -i "s/style.css?v=[0-9]*/style.css?v=$timestamp/" index.html
sed -i "s/app.js?v=[0-9]*/app.js?v=$timestamp/" index.html
'
```

### 步骤 5: 重启服务 (如果修改了后端)
```bash
ssh root@139.59.108.156 'pm2 restart chat-system'
```

### 步骤 6: 测试验证
```
打开浏览器访问: https://chat.fixr2026.com/
使用隐私/无痕模式测试
```

---

##  常用部署命令速查

### 快速部署前端文件
```bash
cd /home/sardenesy/projects/chat-system/client && \
scp index.html style.css app.js root@139.59.108.156:/var/www/chat-system/client/ && \
echo "✅ 部署完成!"
```

### 更新文件时间戳 (强制刷新缓存)
```bash
ssh root@139.59.108.156 '
cd /var/www/chat-system/client
timestamp=$(date +%s)
sed -i "s/style.css?v=[0-9]*/style.css?v=$timestamp/" index.html
sed -i "s/app.js?v=[0-9]*/app.js?v=$timestamp/" index.html
echo "✅ 缓存已更新: $timestamp"
'
```

### 重启后端服务
```bash
ssh root@139.59.108.156 'pm2 restart chat-system && pm2 status'
```

### 查看服务状态
```bash
# 查看 PM2 状态
ssh root@139.59.108.156 'pm2 status'

# 查看实时日志
ssh root@139.59.108.156 'pm2 logs chat-system --lines 50'

# 查看 Nginx 状态
ssh root@139.59.108.156 'systemctl status nginx'
```

---

## 🐛 常见问题排查

### 问题 1: SSH 连接失败
```bash
# 错误提示: Permission denied (publickey)
# 解决方法: 确认 SSH 密钥已配置

# 测试连接
ssh -v root@139.59.108.156
```

### 问题 2: 文件上传后页面没变化
```bash
# 原因: 浏览器缓存
# 解决方法: 更新文件时间戳

ssh root@139.59.108.156 '
cd /var/www/chat-system/client
timestamp=$(date +%s)
sed -i "s/style.css?v=[0-9]*/style.css?v=$timestamp/" index.html
sed -i "s/app.js?v=[0-9]*/app.js?v=$timestamp/" index.html
'
```

### 问题 3: 修改后端代码后没生效
```bash
# 原因: Node.js 进程未重启
# 解决方法: 重启 PM2 服务

ssh root@139.59.108.156 'pm2 restart chat-system'
```

### 问题 4: Nginx 配置错误
```bash
# 检查配置语法
ssh root@139.59.108.156 'nginx -t'

# 重新加载 Nginx
ssh root@139.59.108.156 'systemctl reload nginx'

# 查看 Nginx 日志
ssh root@139.108.156 'tail -f /var/log/nginx/error.log'
```

### 问题 5: MongoDB 数据库操作
```bash
# 连接数据库
ssh root@139.59.108.156 'mongosh fixturerb2b_chat'

# 查看用户列表
ssh root@139.59.108.156 'mongosh fixturerb2b_chat --eval "db.users.find().pretty()"'

# 更新用户名
ssh root@139.59.108.156 'mongosh fixturerb2b_chat --eval "db.users.updateOne({username: \"Admin\"}, {$set: {username: \"客服\"}})"'
```

---

##  项目文件结构

### 本地开发路径
```
/home/sardenesy/projects/chat-system/
├── client/              # 前端文件
│   ├── index.html       # 主页面
│   ├── style.css        # 样式文件
│   ├── app.js           # JavaScript 逻辑
│   └── debug.html       # 诊断页面
├── server/              # 后端代码
│   ├── server.js        # Express 服务器
│   └── package.json     # 依赖配置
── package.json
```

### 线上部署路径
```
/var/www/chat-system/
├── client/              # 前端文件 (Nginx 服务)
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── debug.html
├── server/              # 后端代码 (PM2 管理)
│   ├── server.js
│   └── node_modules/
── package.json
```

---

## 🔐 SSH 连接说明

### 免密登录已配置
```bash
# 直接连接,不需要密码
ssh root@139.59.108.156

# 执行远程命令
ssh root@139.59.108.156 '命令'

# 传输文件
scp 本地文件 root@139.59.108.156:远程路径
```

### 如果提示需要密码
```bash
# 检查 SSH 密钥
ls -la ~/.ssh/

# 查看是否有 id_rsa 或 id_ed25519
# 如果没有,需要生成密钥:
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加密钥到 SSH agent
ssh-add ~/.ssh/id_ed25519
```

---

## 📊 服务管理命令

### PM2 进程管理
```bash
# 查看所有进程
ssh root@139.59.108.156 'pm2 list'

# 启动服务
ssh root@139.59.108.156 'pm2 start server/server.js --name chat-system'

# 停止服务
ssh root@139.59.108.156 'pm2 stop chat-system'

# 重启服务
ssh root@139.59.108.156 'pm2 restart chat-system'

# 删除服务
ssh root@139.59.108.156 'pm2 delete chat-system'

# 查看日志
ssh root@139.59.108.156 'pm2 logs chat-system'

# 监控
ssh root@139.59.108.156 'pm2 monit'
```

### Nginx 服务管理
```bash
# 检查配置
ssh root@139.59.108.156 'nginx -t'

# 重新加载
ssh root@139.59.108.156 'systemctl reload nginx'

# 重启
ssh root@139.59.108.156 'systemctl restart nginx'

# 查看状态
ssh root@139.59.108.156 'systemctl status nginx'

# 查看访问日志
ssh root@139.59.108.156 'tail -f /var/log/nginx/access.log'
```

---

##  部署后测试清单

### 基础功能测试
- [ ] 访问 https://chat.fixr2026.com/ 能正常打开
- [ ] 输入称呼后点击"进入聊天"能正常跳转
- [ ] 聊天界面显示正常(不需要滑动)
- [ ] 输入框在底部可见
- [ ] 发送消息功能正常
- [ ] 用户名显示为"客服"(不是 Admin)

### 按钮功能测试
- [ ] 发送按钮(纸飞机)能发送消息
- [ ] 语音按钮能响应
- [ ] 图片按钮能打开选择器
- [ ] 文件按钮能打开选择器
- [ ] 表情按钮能显示表情面板
- [ ] 翻译按钮能切换状态
- [ ] 注销按钮能弹出确认对话框

### 界面检查
- [ ] 移动端(<768px)隐藏侧边栏
- [ ] 聊天区域占满全屏
- [ ] 消息气泡显示正常
- [ ] 头像颜色正确
- [ ] 深色模式正常

---

## 📝 部署记录模板

每次部署后记录:

```
部署时间: 2026-05-03 XX:XX
部署内容: 
- 修复了 XXX 问题
- 添加了 XXX 功能

修改文件:
- client/index.html
- client/style.css
- client/app.js

部署命令:
scp index.html style.css app.js root@139.59.108.156:/var/www/chat-system/client/

测试结果:
✅ 所有功能正常
️  XXX 功能需要进一步优化

备注:
```

---

##  一键部署脚本

创建部署脚本 `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 开始部署聊天系统..."

# 1. 进入项目目录
cd /home/sardenesy/projects/chat-system/client

# 2. 上传文件
echo "📤 上传文件到服务器..."
scp index.html style.css app.js root@139.59.108.156:/var/www/chat-system/client/

# 3. 更新时间戳
echo "⏰ 更新文件时间戳..."
ssh root@139.59.108.156 '
cd /var/www/chat-system/client
timestamp=$(date +%s)
sed -i "s/style.css?v=[0-9]*/style.css?v=$timestamp/" index.html
sed -i "s/app.js?v=[0-9]*/app.js?v=$timestamp/" index.html
'

# 4. 验证
echo "✅ 验证部署..."
ssh root@139.59.108.156 'ls -lh /var/www/chat-system/client/*.html /var/www/chat-system/client/*.css /var/www/chat-system/client/*.js'

echo "🎉 部署完成!"
echo "📱 测试地址: https://chat.fixr2026.com/"
echo "💡 提示: 请使用隐私/无痕模式测试"
```

使用方法:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

##  快速参考卡片

```
─────────────────────────────────────────────┐
│          聊天系统部署速查卡                  │
├─────────────────────────────────────────────┤
│ 服务器 IP: 139.59.108.156                   │
│ SSH 用户: root (免密)                       │
│ 项目路径: /var/www/chat-system/             │
│ 本地路径: /home/sardenesy/projects/         │
│                                              │
│ 快速部署:                                    │
│ scp *.html *.css *.js \                      │
│   root@139.59.108.156:                      │
│   /var/www/chat-system/client/              │
│                                              │
│ 更新缓存:                                    │
│ ssh root@IP '                               │
│   cd /var/www/chat-system/client &&         │
│   sed -i "s/v=[0-9]*/v=$(date +%s)/" *      │
│ '                                            │
│                                              │
│ 重启服务:                                    │
│ ssh root@IP 'pm2 restart chat-system'       │
│                                              │
│ 测试地址:                                    │
│ https://chat.fixr2026.com/               │
└─────────────────────────────────────────────┘
```

---

## 📞 支持信息

如果部署遇到问题:

1. **检查 SSH 连接**: `ssh root@139.59.108.156`
2. **查看服务状态**: `ssh root@139.59.108.156 'pm2 status'`
3. **查看日志**: `ssh root@139.59.108.156 'pm2 logs chat-system'`
4. **检查 Nginx**: `ssh root@139.59.108.156 'nginx -t'`

---

**最后更新**: 2026-05-03
**维护者**: Fixturerb2b 团队
