# SaleSmartly 快速配置指南（5 分钟完成）

## ✅ 你已经完成了注册

现在只需要 3 步就能启用聊天功能！

---

## 📋 配置步骤

### 第 1 步：获取 Project ID（1 分钟）

1. **登录 SaleSmartly 仪表板**
   - 网址：https://www.salesmartly.com/dashboard

2. **进入项目设置**：
   - 点击左侧菜单的 **"设置"** (Settings)
   - 选择 **"项目设置"** (Project Settings)

3. **找到 Project ID**：
   - 通常是一串数字，例如：`123456`
   - 或者类似：`abc123def456`
   - 点击复制按钮

### 第 2 步：配置到项目（1 分钟）

编辑 `.env` 文件：

```bash
nano .env
```

找到这一行：
```env
VITE_SALESMARTLY_PROJECT_ID=
```

填入你的 Project ID：
```env
VITE_SALESMARTLY_PROJECT_ID=你的实际ProjectID
```

保存文件（Ctrl+O，然后 Enter，然后 Ctrl+X 退出）

### 第 3 步：重启服务器（30 秒）

在终端按 `Ctrl+C` 停止当前服务器，然后重新启动：

```bash
npm run dev
```

### 第 4 步：测试（2 分钟）

1. **打开网站**：http://localhost:8090
2. **查看右下角**：应该能看到 SaleSmartly 聊天按钮
3. **点击测试**：发送一条消息
4. **在 SaleSmartly 仪表板查看**：确认收到消息

---

## 🎯 接下来要做的

### 1. 配置聊天渠道（重要！）

虽然你注册了 SaleSmartly，但还需要配置具体的聊天渠道：

#### 立即可用的渠道（不需要 WhatsApp）：

✅ **网站在线聊天**
- 已经集成
- 客户可以直接在网站聊天

✅ **Email**
- 配置客服邮箱
- 客户发邮件，你在 SaleSmartly 回复

✅ **Telegram**
- 如果有 Telegram 账号
- 可以绑定到 SaleSmartly

✅ **Facebook Messenger**
- 如果有 Facebook Page
- 可以绑定

#### 稍后配置的渠道：

⏳ **WhatsApp**
- 等你有办法注册 WhatsApp 后再配置
- 可以通过虚拟号码或其他方式

### 2. 设置欢迎语

在 SaleSmartly 仪表板：
- 设置 → 自动回复
- 配置欢迎语

**推荐欢迎语**：
```
您好！欢迎来到 fixturerb2b.top 👋

我们提供专业的商业家具制造服务：
✅ OEM/ODM 代工
✅ 图纸到实物 1:1 还原
✅ 无最小起订量限制

请问有什么可以帮助您的？
```

### 3. 下载手机 App

- iOS：App Store 搜 "SaleSmartly"
- Android：Google Play 搜 "SaleSmartly"
- 用你的账号登录
- 开启通知权限

---

## 🔧 故障排查

### 问题 1：聊天按钮不显示

**检查清单**：
1. ✅ `.env` 中填入了正确的 Project ID
2. ✅ 重启了开发服务器
3. ✅ 清除了浏览器缓存

**解决方法**：
```bash
# 清除缓存
rm -rf node_modules/.vite

# 重启
npm run dev
```

### 问题 2：收不到消息

**检查**：
1. SaleSmartly 仪表板的"消息中心"
2. 手机 App 的通知设置
3. 邮箱通知设置

---

## 💡 提示

1. **先用网站聊天**：这是最简单的，客户直接在你的网站发消息
2. **配置 Email**：作为备用联系方式
3. **等有空再折腾 WhatsApp**：现在先用其他渠道接客

---

## ✅ 完成检查清单

- [ ] 登录了 SaleSmartly 仪表板
- [ ] 获取了 Project ID
- [ ] 填入了 `.env` 文件
- [ ] 重启了开发服务器
- [ ] 网站显示聊天按钮
- [ ] 测试发送了消息
- [ ] 在仪表板收到了测试消息
- [ ] 下载了手机 App
- [ ] 设置了欢迎语

全部完成后，客户就可以通过网站聊天联系你了！🎉

---

需要帮助随时问我！
