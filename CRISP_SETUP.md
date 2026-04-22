# Crisp 在线客服集成指南（无域名限制）⭐

## 🎯 为什么选择 Crisp？

✅ **无域名限制** - 任何域名都可以  
✅ **邮箱注册** - 不需要手机号  
✅ **超轻量** - 加载速度快  
✅ **完全免费** - 免费版功能强大  
✅ **国内可用** - 访问稳定  

---

## 📋 3 步完成配置

### 第 1 步：注册 Crisp（2 分钟）

1. **访问官网**：https://crisp.chat

2. **点击 "Get Started" 或 "Start for Free"**

3. **填写信息**：
   - Email：你的邮箱
   - Password：设置密码
   - Website name：`fixturerb2b.top`（这个名字随便填）
   - Website URL：如果允许就填 `https://fixturerb2b.top`，如果不允许就填 `https://example.com`

4. **验证邮箱**：
   - 查收验证邮件
   - 点击验证链接

### 第 2 步：获取 Website ID（1 分钟）

1. **登录 Crisp 仪表板**

2. **点击左下角的设置图标** ⚙️

3. **进入 "Website Settings"**

4. **找到 "Website ID"**：
   - 类似：`a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`
   - 点击复制按钮

5. **配置到项目**：

   编辑 `.env` 文件：
   ```bash
   nano .env
   ```

   添加这一行：
   ```env
   VITE_CRISP_WEBSITE_ID=a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6
   ```

   保存并重启服务器：
   ```bash
   npm run dev
   ```

### 第 3 步：测试（2 分钟）

1. **打开网站**：http://localhost:8090
2. **查看右下角**：应该能看到 Crisp 聊天按钮
3. **点击测试**：发送一条消息
4. **在 Crisp 仪表板查看**：确认收到消息

---

## 💡 Crisp 优势

- 🚀 **加载速度快**：比 Tidio 更轻量
- 🎨 **可定制**：可以修改颜色和样式
- 📱 **手机 App**：iOS/Android 都有
- 🤖 **自动回复**：可以设置聊天机器人
- 🌍 **多语言**：支持中文界面

---

## ✅ 完成！

配置完成后，客户就可以通过网站聊天联系你了！

有任何问题随时问我。
