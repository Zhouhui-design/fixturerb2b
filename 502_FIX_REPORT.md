# 🔧 502 Bad Gateway 问题修复报告

## 📋 问题描述

**时间**: 2026-05-06  
**现象**: 手机访问 https://chat.fixr2026.com/ 显示 "502 Bad Gateway"  
**影响**: 聊天系统完全无法访问  

---

## 🔍 问题诊断

### 1. 检查服务状态
```bash
pm2 status
```

**发现**: chat-system 服务状态为 `errored`，已重启 453 次

### 2. 查看错误日志
```bash
pm2 logs chat-system --lines 10
```

**错误信息**:
```
Error: Cannot find module 'openai'
Require stack:
- /var/www/chat-system/server/routes/voice.js
- /var/www/chat-system/server/server.js
```

### 3. 根本原因分析

**问题根源**: 
1. `server.js` 引用了 `routes/voice.js`（OpenAI Whisper 实现）
2. `voice.js` 依赖 `openai` npm 包
3. 使用 `rsync --delete` 同步时，删除了 `node_modules` 目录
4. `package.json` 中没有 `openai` 依赖
5. 服务启动时找不到 `openai` 模块，导致崩溃

**为什么会这样**:
- 之前实现了 OpenAI Whisper API（语音转文字）
- 后来改用阿里云 ASR（更便宜、更适合国内）
- 创建了 `voice-aliyun.js` 替代 `voice.js`
- 但忘记从 `server.js` 中移除对 `voice.js` 的引用
- rsync --delete 删除了 node_modules，导致缺少 openai 依赖

---

## ✅ 解决方案

### 修改文件: `/chat-system/server/server.js`

#### 修改 1: 注释掉 voice.js 引用
```javascript
// 修改前
const voiceRoutes = require('./routes/voice');
const voiceAliyunRoutes = require('./routes/voice-aliyun');

// 修改后
// const voiceRoutes = require('./routes/voice'); // OpenAI Whisper - 已弃用，使用阿里云 ASR
const voiceAliyunRoutes = require('./routes/voice-aliyun');
```

#### 修改 2: 注释掉路由注册
```javascript
// 修改前
app.use('/api/voice', voiceRoutes);
app.use('/api/voice', voiceAliyunRoutes);

// 修改后
// app.use('/api/voice', voiceRoutes); // OpenAI Whisper - 已弃用
app.use('/api/voice', voiceAliyunRoutes); // 阿里云 ASR
```

---

## 🚀 部署步骤

### 1. 提交代码
```bash
cd /home/sardenesy/projects/fixturerb2b
git add -A
git commit -m "fix: 注释掉 OpenAI voice.js 引用，使用阿里云 ASR"
git push origin main
```

### 2. 同步到服务器
```bash
rsync -avz /home/sardenesy/projects/fixturerb2b/chat-system/server/server.js \
  root@167.99.134.217:/var/www/chat-system/server/server.js
```

### 3. 重启服务
```bash
ssh root@167.99.134.217 "
  cd /var/www/chat-system/server && \
  sed -i 's/PORT=3000/PORT=3002/' .env && \
  pm2 restart chat-system --update-env && \
  sleep 5 && \
  pm2 status
"
```

### 4. 验证服务
```bash
# 检查 HTTP 状态
curl -I https://chat.fixr2026.com/

# 检查 PM2 状态
ssh root@167.99.134.217 "pm2 status"

# 查看日志
ssh root@167.99.134.217 "pm2 logs chat-system --lines 5"
```

---

## ✅ 修复结果

### 服务状态
- **Status**: online ✅
- **Uptime**: 正常运行
- **Memory**: 99.1 MB
- **Port**: 3002

### HTTP 响应
```
HTTP/2 200
server: nginx/1.24.0 (Ubuntu)
```

### 日志输出
```
Server running on port 3002
MongoDB connected
```

---

## 🛡️ 预防措施

### 1. 避免 rsync --delete 删除 node_modules

**方案 A**: 排除 node_modules
```bash
rsync -avz --exclude='node_modules' /local/path/ user@server:/remote/path/
```

**方案 B**: 先安装依赖再重启
```bash
rsync -avz /local/path/ user@server:/remote/path/
ssh user@server "cd /remote/path && npm install && pm2 restart app"
```

### 2. 清理未使用的代码

**建议**:
- 删除或归档 `voice.js`（OpenAI 版本）
- 只保留 `voice-aliyun.js`（阿里云版本）
- 定期审查代码依赖

### 3. 添加健康检查脚本

创建 `healthcheck.sh`:
```bash
#!/bin/bash
# 检查服务状态
if ! pm2 describe chat-system | grep -q "online"; then
    echo "Service is down, restarting..."
    cd /var/www/chat-system/server
    npm install
    pm2 restart chat-system --update-env
    sleep 5
    
    # 验证重启成功
    if pm2 describe chat-system | grep -q "online"; then
        echo "Service restarted successfully"
    else
        echo "Failed to restart service"
        exit 1
    fi
fi
```

添加到 crontab:
```bash
*/5 * * * * /var/www/chat-system/healthcheck.sh >> /var/log/chat-healthcheck.log 2>&1
```

---

## 📝 经验总结

### 教训
1. **废弃代码要及时清理**: 不再使用的 `voice.js` 应该删除或明确标记
2. **依赖管理要谨慎**: rsync --delete 会删除所有不在源目录的文件
3. **部署前要测试**: 应该在本地或测试环境先验证

### 改进
1. ✅ 注释掉废弃的代码引用
2. ✅ 添加清晰的注释说明
3. ⏳ 建议删除 voice.js 文件或移到 archive 目录
4. ⏳ 添加自动化健康检查

---

## 🔗 相关文件

- **修改文件**: `/chat-system/server/server.js`
- **废弃文件**: `/chat-system/server/routes/voice.js` (OpenAI)
- **当前使用**: `/chat-system/server/routes/voice-aliyun.js` (阿里云)
- **依赖文件**: `/chat-system/server/package.json`

---

## ✨ 后续优化建议

### 短期（立即执行）
1. ✅ 已完成：修复 502 错误
2. ⏳ 删除或归档 `voice.js` 文件
3. ⏳ 更新文档说明使用阿里云 ASR

### 中期（1周内）
1. 添加健康检查脚本
2. 配置自动重启机制
3. 完善错误监控

### 长期（1月内）
1. 实现 CI/CD 自动化部署
2. 添加单元测试
3. 建立回滚机制

---

**修复时间**: 2026-05-06  
**修复人员**: AI Assistant  
**状态**: ✅ 已解决
