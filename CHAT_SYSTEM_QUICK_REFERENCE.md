# 聊天系统快速参考手册

## 📚 文档索引

### 核心文档
1. [完整优化总结](./CHAT_SYSTEM_COMPLETE_OPTIMIZATION_SUMMARY.md) - 所有功能详细说明
2. [测试清单](./CHAT_SYSTEM_TEST_CHECKLIST.md) - 全面的功能测试指南
3. [用户反馈表](./CHAT_SYSTEM_USER_FEEDBACK_FORM.md) - 收集用户意见
4. [未来路线图](./CHAT_SYSTEM_FUTURE_ROADMAP.md) - 后续优化规划

---

## 🚀 快速开始

### 访问地址
- **客户端**: https://chat.fixr2026.com
- **管理员**: https://chat.fixr2026.com/admin.html

### 管理员登录
- **用户名**: Admin
- **密码**: admin123456
- ⚠️ 首次登录后请修改密码

---

## 🔧 常用命令

### 服务器管理
```bash
# SSH 登录
ssh root@139.59.108.156

# 查看服务状态
pm2 status

# 查看日志
pm2 logs chat-system --lines 50

# 重启服务
pm2 restart chat-system

# 监控资源
pm2 monit
```

### 数据库操作
```bash
# 连接 MongoDB
mongosh

# 切换数据库
use chat_system

# 查看所有集合
show collections

# 查询消息
db.messages.find({tenantId: 'fixturerb2b'}).limit(10)

# 统计用户数
db.users.countDocuments({tenantId: 'fixturerb2b'})
```

### 文件同步
```bash
# 从本地同步到服务器
cd /home/sardenesy/projects/chat-system
scp client/* root@139.59.108.156:/usr/share/nginx/html/chat/
scp -r server/* root@139.59.108.156:/var/www/chat-system/server/

# 重启服务
ssh root@139.59.108.156 "pm2 restart chat-system"
```

---

## ⚙️ 配置要点

### Resend 邮件配置（待完成）

需要在服务器上设置环境变量：

```bash
ssh root@139.59.108.156
nano /var/www/chat-system/server/.env
```

添加以下内容：
```env
RESEND_API_KEY=re_your_actual_api_key_here
ADMIN_EMAIL=admin@fixr2026.com
FROM_EMAIL=noreply@fixr2026.com
```

然后重启服务：
```bash
pm2 restart chat-system
```

获取 API Key: https://resend.com/api-keys

---

## 🎯 功能速查

### 客户端功能

| 功能 | 操作方式 | 说明 |
|------|---------|------|
| 快捷登录 | 输入称呼 → 进入聊天 | 无长度限制 |
| 正式注册 | 点击"注册" → 填写信息 | 记录保存1年 |
| 发送消息 | 输入文字 → 发送 | 支持 Enter 发送 |
| 文件上传 | 点击 📎 按钮 | 图片+文档，≤10MB |
| 夜间模式 | 点击右下角 🌙 | 自动保存偏好 |
| 消息撤回 | 右键/长按消息 | 2分钟内有效 |

### 管理员功能

| 功能 | 操作方式 | 说明 |
|------|---------|------|
| 查看客户 | 左侧列表 | 显示在线状态 |
| 回复消息 | 选择客户 → 输入回复 | 实时通信 |
| 统计数据 | 点击 📊 按钮 | 5个关键指标 |
| 文件查看 | 自动显示 | 图片预览+下载 |
| 已读状态 | 自动显示 ✓✓ | 实时反馈 |

---

## 🐛 故障排查

### 常见问题

#### 1. 服务无法访问
```bash
# 检查服务状态
pm2 status

# 检查端口
netstat -tlnp | grep 3000

# 检查 Nginx
systemctl status nginx

# 重启服务
pm2 restart chat-system
systemctl restart nginx
```

#### 2. 消息发送失败
```bash
# 查看日志
pm2 logs chat-system --lines 100

# 检查 MongoDB
systemctl status mongod

# 测试 WebSocket
# 浏览器 F12 → Network → WS
```

#### 3. 文件上传失败
```bash
# 检查上传目录权限
ls -la /var/www/chat-system/server/uploads/

# 查看错误日志
pm2 logs | grep -i upload

# 检查文件大小限制
# 前端: 10MB
# 后端: multer 配置
```

#### 4. 邮件未发送
```bash
# 检查环境变量
cat /var/www/chat-system/server/.env | grep RESEND

# 查看邮件日志
pm2 logs | grep -i email

# 测试 SMTP 连接
# 需要配置正确的 API Key
```

#### 5. 夜间模式不生效
```javascript
// 浏览器控制台执行
localStorage.removeItem('chat_theme');
location.reload();
```

---

## 📊 监控指标

### 关键指标

| 指标 | 正常范围 | 检查方法 |
|------|---------|---------|
| CPU 使用率 | < 70% | `pm2 monit` |
| 内存使用 | < 500MB | `pm2 monit` |
| 响应时间 | < 200ms | 浏览器 DevTools |
| WebSocket 连接 | 稳定 | Network → WS |
| 数据库连接 | 正常 | `mongosh` 测试 |

### 日志位置

```bash
# PM2 日志
~/.pm2/logs/chat-system-out.log
~/.pm2/logs/chat-system-error.log

# Nginx 日志
/var/log/nginx/access.log
/var/log/nginx/error.log

# MongoDB 日志
/var/log/mongodb/mongod.log
```

---

## 🔐 安全提醒

### 必须做的
- [ ] 修改默认管理员密码
- [ ] 配置 HTTPS（已完成）
- [ ] 定期备份数据库
- [ ] 更新依赖包
- [ ] 监控异常登录

### 不要做的
- ❌ 不要将 API Key 提交到 Git
- ❌ 不要使用弱密码
- ❌ 不要开放不必要的端口
- ❌ 不要忽略安全更新

---

## 📞 技术支持

### 内部支持
- 项目负责人: _______________
- 技术联系人: _______________
- 紧急联系: _______________

### 外部资源
- Resend 文档: https://resend.com/docs
- MongoDB 文档: https://docs.mongodb.com
- Socket.IO 文档: https://socket.io/docs
- Node.js 文档: https://nodejs.org/docs

---

## 🔄 维护计划

### 每日
- [ ] 检查服务状态
- [ ] 查看错误日志
- [ ] 监控系统资源

### 每周
- [ ] 清理临时文件
- [ ] 备份数据库
- [ ] 检查磁盘空间

### 每月
- [ ] 更新依赖包
- [ ] 审查安全日志
- [ ] 性能优化评估

### 每季度
- [ ] 全面测试
- [ ] 用户反馈收集
- [ ] 功能迭代规划

---

## 📝 更新记录模板

当系统进行更新时，请记录：

```markdown
## 更新记录

**日期**: YYYY-MM-DD
**版本**: v X.X.X
**更新人**: ___________

### 更新内容
- 
- 
- 

### 影响范围
- 

### 回滚方案
- 

### 测试结果
- [ ] 功能测试通过
- [ ] 性能测试通过
- [ ] 安全测试通过
```

---

## 💡 最佳实践

### 开发
- 先在本地测试，再部署到服务器
- 使用 Git 版本控制
- 编写清晰的注释
- 遵循代码规范

### 部署
- 使用 SCP 同步文件
- 部署前备份数据
- 灰度发布新功能
- 监控部署后状态

### 运维
- 定期检查日志
- 及时响应告警
- 保持文档更新
- 收集用户反馈

---

## 🎓 学习资源

### 相关技术
- **Node.js**: https://nodejs.org/learn
- **MongoDB**: https://university.mongodb.com
- **Socket.IO**: https://socket.io/get-started
- **React**: https://react.dev/learn
- **Nginx**: https://nginx.org/en/docs

### 推荐课程
- Node.js 实战
- MongoDB 高级应用
- WebSocket 编程
- 系统架构设计

---

**最后更新**: 2026-05-02  
**版本**: v3.0  
**维护者**: Fixturerb2b 团队
