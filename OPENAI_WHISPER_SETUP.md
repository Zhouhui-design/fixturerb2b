# OpenAI Whisper API 配置指南

## 📝 获取 API Key 步骤

### 1. 注册 OpenAI 账号

**官网**: https://platform.openai.com/

1. 访问 https://platform.openai.com/signup
2. 使用邮箱或 Google/GitHub 账号注册
3. 验证邮箱
4. 完成手机号验证（可能需要）

### 2. 获取 API Key

**API Keys 页面**: https://platform.openai.com/api-keys

1. 登录后点击左侧菜单 "API keys"
2. 点击 "Create new secret key"
3. 输入名称（例如：Chat System STT）
4. 点击 "Create secret key"
5. **复制并保存 API Key**（格式: `sk-proj-xxxxxxxx...`）

⚠️ **重要**: API Key 只显示一次，请立即保存！

### 3. 查看余额

**账单页面**: https://platform.openai.com/settings/organization/billing/overview

**新用户福利**:
- ✅ 自动获得 **$5 赠金**（约可处理 833 分钟音频）
- 💰 如需充值：最低 $5，支持信用卡/PayPal

---

## 🔧 服务器配置步骤

### 1. SSH 登录服务器

```bash
ssh root@167.99.134.217
```

### 2. 编辑 .env 文件

```bash
cd /var/www/chat-system/server
nano .env
```

### 3. 添加 OpenAI API Key

在 `.env` 文件中添加以下行：

```env
OPENAI_API_KEY=sk-proj-your-api-key-here
```

将 `sk-proj-your-api-key-here` 替换为您的实际 API Key。

### 4. 保存并退出

- 按 `Ctrl + O` 保存
- 按 `Enter` 确认
- 按 `Ctrl + X` 退出

### 5. 重启服务

```bash
pm2 restart chat-system --update-env
pm2 logs chat-system --lines 20
```

应该看到日志：
```
[Whisper] OpenAI client initialized
```

---

## 🧪 测试功能

### 测试步骤

1. 访问 https://chat.fixr2026.com/
2. 发送一条语音消息（使用麦克风按钮录音）
3. 点击语音消息的三个点菜单
4. 选择"语音转文字"
5. 点击【确定】转换此语音消息
6. 等待识别完成
7. 查看识别结果

### 预期结果

- ✅ 显示加载界面："正在转换..."
- ✅ 几秒后显示识别结果
- ✅ 可以复制或填入输入框

---

## 💰 费用说明

### 收费标准

- **价格**: $0.006 / 分钟（约 ¥0.043 / 分钟）
- **计费方式**: 按音频时长计费

### 示例计算

```
1 分钟音频 = $0.006（约 ¥0.043）
10 分钟音频 = $0.06（约 ¥0.43）
1 小时音频 = $0.36（约 ¥2.6）
10 小时音频 = $3.6（约 ¥26）
```

### 新用户赠金

- **赠金金额**: $5
- **可处理时长**: 约 833 分钟（13.9 小时）
- **有效期**: 无限制（直到用完）

### 预计月度费用

假设每天 10 条语音消息，每条 1 分钟：

```
每月 = 10 × 30 × 1 = 300 分钟
费用 = 300 × $0.006 = $1.8/月（约 ¥13/月）
```

---

## ⚠️ 常见问题

### 问题 1: 显示"语音转文字服务未配置"

**原因**: OPENAI_API_KEY 未配置或配置错误

**解决方案**:
1. 检查 `.env` 文件是否正确配置
2. 确认 API Key 格式正确（以 `sk-` 开头）
3. 重启 PM2 服务：`pm2 restart chat-system --update-env`
4. 查看日志：`pm2 logs chat-system`

### 问题 2: 显示"API Key 无效"

**原因**: API Key 错误或已过期

**解决方案**:
1. 登录 OpenAI 平台检查 API Key 状态
2. 重新生成 API Key
3. 更新 `.env` 文件
4. 重启服务

### 问题 3: 显示"API 额度已用完"

**原因**: $5 赠金已用完或未充值

**解决方案**:
1. 访问账单页面查看余额
2. 充值至少 $5
3. 或等待下个月（如果有月度配额）

### 问题 4: 转换速度慢

**原因**: 
- 音频文件较大
- 网络延迟
- OpenAI API 响应慢

**解决方案**:
- 正常情况：1 分钟音频约需 3-5 秒
- 如果超过 10 秒，检查网络连接
- 考虑升级服务器带宽

### 问题 5: 识别不准确

**原因**:
- 音频质量差
- 背景噪音大
- 口音重

**解决方案**:
- Whisper 是业界最准确的 STT 模型
- 如果仍不准确，检查音频质量
- 尝试清晰发音，减少背景噪音

---

## 🔒 安全建议

### 1. 保护 API Key

- ❌ 不要将 API Key 提交到 Git
- ❌ 不要在客户端代码中使用
- ✅ 仅在服务器端 `.env` 文件中配置
- ✅ 定期轮换 API Key

### 2. 设置使用限额

在 OpenAI 平台设置月度使用限额，防止意外高额费用：

1. 访问 https://platform.openai.com/settings/organization/limits
2. 设置 "Monthly spending limit"
3. 建议设置为 $10-20/月

### 3. 监控使用情况

定期检查使用情况和费用：

- 访问 https://platform.openai.com/usage
- 查看每日/每月使用量
- 设置告警通知

---

## 📊 API 文档

### 转录 API

**端点**: `POST /api/voice/transcribe`

**请求**:
- `audio`: 音频文件 (multipart/form-data)
- `language`: 目标语言 (可选，默认 auto)

**响应**:
```json
{
  "success": true,
  "text": "识别的文字",
  "language": "zh",
  "duration": 5.2,
  "segments": 3
}
```

### 转录并翻译 API

**端点**: `POST /api/voice/transcribe-and-translate`

**请求**:
- `audio`: 音频文件
- `targetLang`: 目标翻译语言 (例如: zh, en, ja)

**响应**:
```json
{
  "success": true,
  "original": "原始识别文字",
  "translated": "翻译后的文字",
  "targetLang": "zh"
}
```

---

## 🚀 后续优化

### 短期优化

1. **缓存识别结果**
   - 对相同音频文件缓存结果
   - 避免重复调用 API

2. **批量处理**
   - 支持同时转换多个语音消息
   - 显示进度条

3. **语言自动检测**
   - 自动识别音频语言
   - 无需手动选择

### 长期优化（方案 C：自建 Whisper）

当业务量增长后，可以考虑自建 Whisper 模型：

**优势**:
- ✅ 完全免费（无 API 调用费）
- ✅ 数据隐私好
- ✅ 无使用限制

**成本**:
- 当前服务器：¥0（已有）
- 如需 GPU 服务器：$20-50/月

**实施时间**: 1-2 天

**触发条件**:
- 每月 API 费用超过 ¥200
- 或对数据隐私有严格要求

---

## 📞 技术支持

如有问题，请查看：

1. OpenAI 官方文档: https://platform.openai.com/docs
2. Whisper API 文档: https://platform.openai.com/docs/guides/speech-to-text
3. PM2 日志: `pm2 logs chat-system`

---

**配置完成后，即可享受高精度的语音转文字功能！** 🎉
