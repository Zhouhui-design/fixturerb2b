# Fixturerb2b 项目技术架构与环境说明

> **用于发送给 OpenClaw 进行故障排查**  
> 生成时间：2026-05-06

---

## 📍 一、服务器信息

### 服务器地址
- **IP 地址**: 167.99.134.217
- **SSH 登录**: `ssh root@167.99.134.217`
- **操作系统**: Ubuntu 24.04 LTS
- **部署位置**: 本地项目 `/home/sardenesy/projects/fixturerb2b`

### 两个独立项目

#### 1. 主站项目 (fixr2026.com)
- **域名**: https://fixr2026.com
- **服务器部署路径**: `/var/www/fixr2026.com/`
- **Nginx 配置**: `/etc/nginx/sites-enabled/fixr2026.com`
- **入口文件**: `/var/www/fixr2026.com/index.html`

#### 2. 聊天系统项目 (chat.fixturerb2b.top)
- **域名**: https://chat.fixturerb2b.top (旧域名 chat.fixturerb2b.top 已迁移)
- **服务器部署路径**: `/var/www/chat-system/`
  - 前端: `/var/www/chat-system/client/`
  - 后端: `/var/www/chat-system/server/`
- **Nginx 配置**: `/etc/nginx/sites-enabled/chat-system`
- **入口文件**: `/var/www/chat-system/client/index.html`
- **管理后台**: `/var/www/chat-system/client/admin.html`

---

## 🏗️ 二、项目架构

### 1. 主站项目 (fixr2026.com)

#### 技术栈
- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 4.x
- **样式框架**: Tailwind CSS 3.x
- **数据库**: Supabase (PostgreSQL)
- **部署方式**: 静态文件 (HTML/CSS/JS)
- **服务器**: Nginx

#### 核心功能
- B2B 产品展示（夹具/fixture 行业）
- 多语言支持（19种语言）
- Google Analytics 跟踪 (GA4: G-LWZXF5WGFB)
- 聊天系统入口按钮
- SEO 优化（Schema Markup、Sitemap）
- 报价请求表单
- 响应式设计（移动端/平板/PC）

#### 项目结构（本地开发）
```
/home/sardenesy/projects/fixturerb2b/
├── src/                    # React 源代码
│   ├── components/        # React 组件
│   │   ├── sections/      # 页面区块组件
│   │   ├── ui/            # UI 基础组件
│   │   ├── ChatWidget.tsx # 聊天组件
│   │   └── ...
│   ├── pages/             # 页面组件
│   ├── config/            # 配置文件
│   ├── i18n/              # 国际化翻译
│   ├── lib/               # 工具库
│   └── ...
├── dist/                  # 构建输出（部署到服务器）
├── public/                # 静态资源
├── supabase/              # Supabase 配置
├── deploy.sh              # 部署脚本
├── nginx.conf             # Nginx 配置模板
└── package.json           # 项目依赖
```

#### 环境依赖
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x",
  "vite": "^4.x",
  "@vitejs/plugin-react": "^4.x",
  "tailwindcss": "^3.x",
  "@supabase/supabase-js": "^2.x"
}
```

#### 构建与部署命令
```bash
# 本地开发
npm run dev

# 构建生产版本
npm run build

# 部署到服务器
bash deploy.sh
```

---

### 2. 聊天系统项目 (chat.fixturerb2b.top)

#### 技术栈
- **后端**: Node.js 18+ + Express 4.x
- **实时通信**: Socket.IO 4.x
- **数据库**: MongoDB 6.x (Mongoose ORM)
- **前端**: Vanilla JavaScript (原生 JS，无框架)
- **文件上传**: Multer
- **邮件服务**: Resend (HTTP API)
- **进程管理**: PM2
- **视频通话**: WebRTC (原生 API)
- **服务器**: Nginx (反向代理)

#### 核心功能
- 实时聊天（WebSocket）
- 用户认证（JWT）
- 文件上传（图片/PDF/视频/音频/文档）
- 语音消息录制与播放
- 视频通话（WebRTC）
- 语音通话（WebRTC）
- 管理员后台
- 消息翻译（MyMemory API）
- 消息通知声音
- 夜间模式
- 消息撤回
- 数据统计面板
- 移动端适配（PWA）

#### 项目结构（本地开发）
```
/home/sardenesy/projects/fixturerb2b/chat-system/
├── client/                # 前端文件
│   ├── index.html         # 客户端聊天界面
│   ├── admin.html         # 管理员后台
│   ├── app.js             # 客户端主逻辑
│   ├── call-manager.js    # WebRTC 通话管理
│   ├── translation-manager.js  # 翻译管理
│   ├── style.css          # 样式文件
│   ├── mobile-fix.css     # 移动端修复样式
│   ── ...
├── server/                # 后端代码
│   ├── server.js          # 主服务器文件
│   ├── models/            # MongoDB 模型
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Tenant.js
│   ├── routes/            # API 路由
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── upload.js
│   │   └── stats.js
│   ├── services/          # 服务层
│   │   └── emailService.js
│   ├── uploads/           # 上传文件存储
│   │   ├── images/
│   │   └── documents/
│   └── package.json       # 后端依赖
└── nginx.conf             # Nginx 配置模板
```

#### 后端依赖
```json
{
  "express": "^4.18.x",
  "mongoose": "^7.x",
  "socket.io": "^4.7.x",
  "multer": "^1.4.x",
  "bcryptjs": "^2.4.x",
  "jsonwebtoken": "^9.x",
  "cors": "^2.8.x",
  "dotenv": "^16.x"
}
```

#### 端口配置
| 服务 | 端口 | 说明 |
|------|------|------|
| Node.js | 3000 | 应用服务器 |
| MongoDB | 27017 | 数据库 |
| Nginx | 80/443 | Web 服务器（反向代理） |

#### 服务器端启动命令
```bash
# 进入后端目录
cd /var/www/chat-system/server

# 安装依赖
npm install

# 使用 PM2 启动
pm2 start server.js --name chat-system
pm2 save
pm2 startup

# 查看日志
pm2 logs chat-system

# 重启服务
pm2 restart chat-system
```

---

## 🔧 三、Nginx 配置

### 主站配置 (fixr2026.com)
```nginx
server {
    listen 80;
    server_name fixr2026.com www.fixr2026.com;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;

    # React Router 支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML 不缓存
    location ~* \.html$ {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

### 聊天系统配置 (chat.fixturerb2b.top)
```nginx
server {
    listen 80;
    server_name chat.fixturerb2b.top;

    # 静态文件
    location / {
        root /usr/share/nginx/html/chat;
        try_files $uri $uri/ /index.html;
    }

    # Socket.IO 代理
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🗄️ 四、数据库配置

### Supabase (主站)
- **类型**: PostgreSQL
- **用途**: 主站数据（产品、报价请求、多语言翻译）
- **连接方式**: 通过 `@supabase/supabase-js` SDK

### MongoDB (聊天系统)
- **类型**: MongoDB 6.x
- **用途**: 聊天消息、用户信息、租户配置
- **连接方式**: Mongoose ORM
- **连接字符串**: 环境变量 `MONGODB_URI`

#### MongoDB 集合结构
```javascript
// users 集合
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (bcrypt 哈希),
  isAdmin: Boolean,
  tenantId: String,
  createdAt: Date,
  lastActive: Date
}

// messages 集合
{
  _id: ObjectId,
  from: ObjectId (用户ID),
  to: ObjectId (用户ID),
  content: String,
  isFile: Boolean,
  fileUrl: String,
  fileName: String,
  fileType: String,
  isAudio: Boolean,
  timestamp: Date,
  read: Boolean
}

// tenants 集合
{
  _id: ObjectId,
  tenantId: String,
  name: String,
  config: Object
}
```

---

## 🔐 五、环境变量配置

### 主站项目 (.env)
```env
VITE_SUPABASE_URL=你的Supabase URL
VITE_SUPABASE_ANON_KEY=你的Supabase 匿名密钥
VITE_GA_ID=G-LWZXF5WGFB
```

### 聊天系统 (server/.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chat-system
JWT_SECRET=你的JWT密钥
RESEND_API_KEY=你的Resend API密钥
NODE_ENV=production
```

---

## 📦 六、部署流程

### 主站部署
```bash
# 1. 本地构建
cd /home/sardenesy/projects/fixturerb2b
npm run build

# 2. 上传到服务器
rsync -avz dist/ root@167.99.134.217:/var/www/fixr2026.com/

# 3. 重启 Nginx
ssh root@167.99.134.217 'systemctl reload nginx'
```

### 聊天系统部署
```bash
# 1. 上传前端文件
rsync -avz chat-system/client/ root@167.99.134.217:/var/www/chat-system/client/

# 2. 上传后端代码
rsync -avz chat-system/server/ root@167.99.134.217:/var/www/chat-system/server/

# 3. SSH 到服务器安装依赖并重启
ssh root@167.99.134.217
cd /var/www/chat-system/server
npm install
pm2 restart chat-system
```

---

##  七、故障排查命令

### 主站故障排查
```bash
# 检查 Nginx 状态
ssh root@167.99.134.217 'systemctl status nginx'

# 查看 Nginx 错误日志
ssh root@167.99.134.217 'tail -f /var/log/nginx/error.log'

# 查看访问日志
ssh root@167.99.134.217 'tail -f /var/log/nginx/access.log'

# 测试网站响应
curl -I https://fixr2026.com

# 检查 SSL 证书
ssh root@167.99.134.217 'certbot certificates'
```

### 聊天系统故障排查
```bash
# 检查 Node.js 进程
ssh root@167.99.134.217 'pm2 list'

# 查看聊天系统日志
ssh root@167.99.134.217 'pm2 logs chat-system'

# 检查 MongoDB 状态
ssh root@167.99.134.217 'systemctl status mongod'

# 检查端口占用
ssh root@167.99.134.217 'netstat -tlnp | grep 3000'

# 测试 API 响应
curl http://localhost:3000/api/health

# 重启聊天系统
ssh root@167.99.134.217 'pm2 restart chat-system'
```

---

## 🌐 八、域名与 DNS

### 当前 DNS 配置
| 域名 | 类型 | 值 | 状态 |
|------|------|----|----|
| fixr2026.com | A | 167.99.134.217 | ✅ 正常 |
| www.fixr2026.com | A | 167.99.134.217 | ✅ 正常 |
| chat.fixturerb2b.top | A | 167.99.134.217 | ✅ 正常 |

### SSL 证书
- **证书提供商**: Let's Encrypt (Certbot)
- **主站证书**: fixr2026.com, www.fixr2026.com
- **聊天系统证书**: chat.fixturerb2b.top
- **自动续期**: Certbot 自动续期（每 60 天）

---

## 📚 九、关键文档位置

### 主站项目文档
- `/home/sardenesy/projects/fixturerb2b/PROJECT_STATUS.md` - 项目完整状态
- `/home/sardenesy/projects/fixturerb2b/DEPLOYMENT.md` - 部署指南
- `/home/sardenesy/projects/fixturerb2b/MULTILINGUAL_AND_DEPLOYMENT_GUIDE.md` - 多语言与部署

### 聊天系统文档
- `/home/sardenesy/projects/fixturerb2b/chat-system/README.md` - 聊天系统说明
- `/home/sardenesy/projects/fixturerb2b/chat-system/PROJECT_SUMMARY.md` - 项目总结
- `/home/sardenesy/projects/fixturerb2b/chat-system/QUICKSTART.md` - 快速开始
- `/home/sardenesy/projects/fixturerb2b/chat-system/DEPLOYMENT_SUMMARY.md` - 部署总结

### 综合文档
- `/home/sardenesy/projects/fixturerb2b/CHAT_SYSTEM_PROJECT_FINAL_SUMMARY.md` - 聊天系统最终总结
- `/home/sardenesy/projects/fixturerb2b/BUG_FIX_REPORT_20260506.md` - Bug 修复报告
- `/home/sardenesy/projects/fixturerb2b/ADMIN_CHAT_FIX_REPORT.md` - 管理员聊天修复报告

---

## 🚨 十、常见问题与解决方案

### 1. 502 Bad Gateway
**原因**: Node.js 服务未启动或崩溃  
**解决**:
```bash
ssh root@167.99.134.217
pm2 list
pm2 restart chat-system
pm2 logs chat-system --lines 100
```

### 2. 聊天系统白屏
**原因**: 前端文件未正确部署或缓存问题  
**解决**:
```bash
# 重新部署前端文件
rsync -avz chat-system/client/ root@167.99.134.217:/var/www/chat-system/client/

# 清除浏览器缓存或使用 Ctrl+F5 强制刷新
```

### 3. MongoDB 连接失败
**原因**: MongoDB 服务未启动  
**解决**:
```bash
ssh root@167.99.134.217
systemctl status mongod
systemctl start mongod
systemctl enable mongod
```

### 4. 文件上传失败
**原因**: uploads 目录权限问题  
**解决**:
```bash
ssh root@167.99.134.217
chmod -R 755 /var/www/chat-system/server/uploads
chown -R www-data:www-data /var/www/chat-system/server/uploads
```

### 5. WebSocket 连接失败
**原因**: Nginx 配置缺少 WebSocket 代理  
**解决**: 检查 nginx.conf 中的 `/socket.io/` 配置

---

## 📞 十一、联系信息

- **项目所有者**: Sardenesy
- **本地工作目录**: `/home/sardenesy/projects/fixturerb2b`
- **Git 仓库**: https://github.com/Zhouhui-design/fixturerb2b
- **服务器 IP**: 167.99.134.217
- **SSH 用户**: root

---

##  十二、项目时间线

- **2026-04-21**: 项目初始化
- **2026-04-23**: 主站部署完成
- **2026-04-23**: 聊天系统基础版本完成
- **2026-05-02**: 聊天系统全面优化（11项新功能）
- **2026-05-05**: 项目架构整理与文档完善
- **2026-05-06**: 文件预览优化、管理员通话功能集成

---

**最后更新**: 2026-05-06 21:30  
**文档版本**: v1.0
