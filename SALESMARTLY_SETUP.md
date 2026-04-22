# SaleSmartly 聊天插件集成指南

## 🎯 功能说明

SaleSmartly 是一个全渠道客户对话平台，集成后你可以：

✅ **整合多个聊天渠道**：
- WhatsApp Business
- Facebook Messenger
- Instagram Direct
- Telegram
- LINE
- WeChat（微信）
- Email
- 网站在线聊天

✅ **统一管理**：
- 所有渠道的消息在一个界面回复
- 自动翻译（支持多语言）
- 客服分配和协作
- 聊天记录保存

✅ **智能功能**：
- 自动回复机器人
- 消息模板
- 客户标签和分组
- 数据分析报表

---

## 📋 注册和配置步骤

### 第 1 步：注册 SaleSmartly 账号

1. 访问 https://www.salesmartly.com
2. 点击"免费注册"或"Sign Up"
3. 使用邮箱注册
4. 验证邮箱

### 第 2 步：创建项目

1. 登录后，点击"创建项目"
2. 填写项目信息：
   - 项目名称：`fixturerb2b.top`（或你的网站名称）
   - 网站地址：`https://fixturerb2b.top`
   - 行业：选择"家具/家居"或"制造业"
3. 点击"创建"

### 第 3 步：获取 Project ID

1. 进入项目仪表板
2. 点击左侧菜单的"设置" → "项目设置"
3. 找到 **Project ID**（通常是一串数字）
4. 复制这个 ID

### 第 4 步：配置聊天渠道

#### 配置 WhatsApp（重要！）

1. 在 SaleSmartly 仪表板，点击"渠道管理"
2. 选择 "WhatsApp"
3. 有两种方式：
   
   **方式 A：WhatsApp Business API（推荐）**
   - 需要 Facebook Business Manager 账号
   - 需要验证 businesses
   - 更稳定，功能更多
   
   **方式 B：WhatsApp Web 扫码（简单）**
   - 用手机 WhatsApp 扫码
   - 类似 WhatsApp Web
   - 适合小规模使用

4. 按照提示完成 WhatsApp 绑定

#### 配置其他渠道（可选）

- **Facebook Messenger**：绑定你的 Facebook Page
- **Instagram**：绑定 Instagram Business 账号
- **Telegram**：创建 Bot 并填入 Token
- **Email**：配置客服邮箱

### 第 5 步：配置到你的网站

1. 打开项目的 `.env` 文件：
   ```bash
   nano .env
   ```

2. 填入你的 Project ID：
   ```env
   VITE_SALESMARTLY_PROJECT_ID=你的ProjectID
   ```

3. 保存文件

4. 重启开发服务器：
   ```bash
   npm run dev
   ```

5. 刷新网站，你应该能在右下角看到聊天按钮！

---

## 🎨 自定义聊天 widget

### 修改位置和样式

编辑 `src/components/SalesmartlyChat.tsx`，可以自定义：

```javascript
_smcc({
  id: projectId,
  container: 'body',
  lang: 'auto',  // 自动检测语言
  position: 'right',  // 'left' 或 'right'
  theme: '#YOUR_COLOR',  // 主题颜色
})
```

### 隐藏默认的 ChatWidget

如果你想只用 SaleSmartly，可以注释掉原来的聊天组件：

编辑 `src/App.tsx`：
```jsx
// <ChatWidget />  // 注释掉这行
<SalesmartlyChat projectId={import.meta.env.VITE_SALESMARTLY_PROJECT_ID || ''} />
```

---

## 📱 手机端使用

1. 下载 SaleSmartly App：
   - iOS: App Store 搜索 "SaleSmartly"
   - Android: Google Play 搜索 "SaleSmartly"

2. 用你的账号登录

3. 开始接收和回复客户消息！

---

## 💡 最佳实践

### 1. 设置欢迎语

在 SaleSmartly 仪表板：
- 设置 → 自动回复
- 配置欢迎语，例如：
  ```
  您好！欢迎来到 fixturerb2b.top 👋
  
  我们提供专业的商业家具制造服务：
  • OEM/ODM 代工
  • 图纸到实物 1:1 还原
  • 无最小起订量限制
  
  请问有什么可以帮助您的？
  ```

### 2. 配置工作时间

- 设置 → 工作时间
- 配置你的在线时间
- 设置离线自动回复

### 3. 创建快捷回复

常用问题预设回复模板：
- 价格咨询
- 最小起订量
- 交货时间
- 定制流程

### 4. 启用自动翻译

- 设置 → 翻译设置
- 启用自动翻译
- 这样你可以用中文回复，客户看到英文（或其他语言）

---

## 🔧 故障排查

### 问题 1：聊天按钮不显示

**检查清单**：
1. `.env` 文件中是否填入了正确的 Project ID
2. 重启了开发服务器
3. 清除了浏览器缓存
4. 检查浏览器控制台是否有错误

**解决方法**：
```bash
# 清除缓存并重启
rm -rf node_modules/.vite
npm run dev
```

### 问题 2：收不到消息通知

**检查**：
1. SaleSmartly App 是否开启通知权限
2. 浏览器是否允许通知
3. 检查 SaleSmartly 仪表板的"消息中心"

### 问题 3：WhatsApp 无法发送消息

**可能原因**：
- WhatsApp 会话过期
- 需要重新扫码

**解决**：
1. 进入 SaleSmartly 仪表板
2. 渠道管理 → WhatsApp
3. 重新扫码登录

---

## 💰 费用说明

SaleSmartly 有免费版和付费版：

**免费版**：
- 2 个客服坐席
- 基础聊天功能
- 有限的渠道接入

**付费版**（约 $29-99/月）：
- 更多坐席
- 高级功能（自动回复、机器人）
- 数据分析
- 优先支持

对于刚起步的独立站，**免费版通常够用**。

---

## 🚀 下一步

1. ✅ 注册 SaleSmartly
2. ✅ 获取 Project ID
3. ✅ 配置到 `.env` 文件
4. ✅ 测试聊天功能
5. ✅ 配置 WhatsApp 等渠道
6. ✅ 下载手机 App
7. ✅ 设置自动回复和工作时间

完成后，国外客户就可以通过 WhatsApp、Messenger 等联系你，你在手机上就能即时回复！🎉

---

## 📞 需要帮助？

- SaleSmartly 官方文档：https://help.salesmartly.com
- SaleSmartly 客服：在仪表板点击右下角聊天

有任何问题随时问我！
