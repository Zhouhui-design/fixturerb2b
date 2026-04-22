# Tidio 在线客服集成指南（适合国内用户）⭐

## 🎯 为什么选择 Tidio？

✅ **无需国外手机号** - 邮箱即可注册  
✅ **国内可直接访问** - 不需要 VPN  
✅ **完全免费** - 免费版功能强大  
✅ **支持中文界面** - 后台有中文  
✅ **手机 App** - iOS/Android 都有  
✅ **WhatsApp 集成** - 后续可以添加  

---

## 📋 3 步完成配置（5 分钟）

### 第 1 步：注册 Tidio 账号（2 分钟）

1. **访问官网**：https://www.tidio.com
   
2. **点击 "Get Started Free"**

3. **填写信息**（只需要邮箱）：
   - Email：你的邮箱（推荐 Gmail、Outlook 或 QQ 邮箱）
   - Password：设置密码
   - Website：`https://fixturerb2b.top`
   
4. **验证邮箱**：
   - 查收验证邮件
   - 点击验证链接

5. **完成初始设置**：
   - 公司名称：填你的公司名
   - 行业：选择 "Manufacturing" 或 "Furniture"
   - 团队规模：选择 "Just me"（只有我）

### 第 2 步：获取 Public Key（1 分钟）

1. **登录 Tidio 仪表板**

2. **点击左下角的设置图标** ⚙️

3. **进入 "Developer" 或 "开发者"**

4. **找到 "Public Key"**：
   - 类似：`a1b2c3d4e5f6g7h8i9j0`
   - 点击复制按钮

5. **配置到项目**：

   编辑 `.env` 文件：
   ```bash
   nano .env
   ```

   填入你的 Public Key：
   ```env
   VITE_TIDIO_PUBLIC_KEY=a1b2c3d4e5f6g7h8i9j0
   ```

   保存并重启服务器：
   ```bash
   Ctrl+C  # 停止当前服务器
   npm run dev  # 重新启动
   ```

### 第 3 步：测试聊天功能（2 分钟）

1. **打开网站**：http://localhost:8090

2. **查看右下角**：应该能看到聊天按钮

3. **点击测试**：
   - 发送一条测试消息
   - 在 Tidio 仪表板查看是否收到

4. **下载手机 App**：
   - iOS：App Store 搜 "Tidio"
   - Android：Google Play 搜 "Tidio"
   - 用邮箱登录

---

## 🎨 自定义聊天窗口

### 修改外观

1. 登录 Tidio 仪表板
2. 进入 **Settings → Chat Channels**
3. 点击 **Live Chat**
4. 可以自定义：
   - 🎨 主题颜色（建议用品牌色）
   - 💬 欢迎语
   - 👤 客服头像
   - 📍 窗口位置

### 设置欢迎语（推荐配置）

```
您好！欢迎来到 fixturerb2b.top 👋

我们提供专业的商业家具制造服务：
✅ OEM/ODM 代工
✅ 图纸到实物 1:1 还原
✅ 无最小起订量限制

请问有什么可以帮助您的？
```

### 配置自动回复

1. 进入 **Chatbot → Templates**
2. 选择 "Welcome Message"
3. 设置触发条件
4. 编写回复内容

---

## 📱 WhatsApp 集成（可选，后续配置）

当你有办法使用 WhatsApp 后，可以这样集成：

### 方法 1：通过 Tidio 集成

1. Tidio 仪表板 → **Settings → Chat Channels**
2. 找到 **WhatsApp**
3. 按照提示绑定 WhatsApp Business
4. 客户发 WhatsApp，你在 Tidio 回复

### 方法 2：直接添加 WhatsApp 按钮

如果暂时无法绑定，可以先加一个简单的 WhatsApp 链接：

编辑 `src/components/Footer.tsx`，在联系方式部分添加：

```jsx
<a 
  href="https://wa.me/86你的手机号" 
  target="_blank" 
  rel="noopener noreferrer"
  className="flex items-center space-x-2 text-muted-foreground hover:text-wood transition-colors"
>
  <span>💬 WhatsApp</span>
</a>
```

---

## 💡 高级功能

### 1. 设置工作时间

- Settings → Business Hours
- 配置：
  - 周一到周五：9:00 - 18:00 (GMT+8)
  - 周六：9:00 - 12:00
  - 周日：休息
- 设置离线留言功能

### 2. 创建快捷回复

常用问题预设回复：

**价格咨询**：
```
感谢您的咨询！我们的价格根据具体产品和数量而定。

请提供：
1. 产品图片或图纸
2. 所需数量
3. 材质要求

我们会给您一个准确的报价。
```

**最小起订量**：
```
我们没有最小起订量限制！

无论是样品还是批量订单，我们都接受。
样品订单通常 7-15 天完成，批量订单根据数量而定。
```

**交货时间**：
```
标准交货时间：
• 样品：7-15 天
• 小批量（<100件）：15-25 天
• 大批量：25-40 天

具体时间根据产品复杂度而定。
```

### 3. 启用邮件通知

- Settings → Notifications
- 开启 Email Notifications
- 这样即使不在线，也能收到邮件提醒

---

## 🔧 故障排查

### 问题 1：聊天按钮不显示

**检查清单**：
1. ✅ `.env` 中填入了正确的 Public Key
2. ✅ 重启了开发服务器
3. ✅ 清除了浏览器缓存

**解决方法**：
```bash
# 清除 Vite 缓存
rm -rf node_modules/.vite

# 重启
npm run dev
```

### 问题 2：收不到消息通知

**检查**：
1. 浏览器是否允许通知权限
2. Tidio App 是否开启推送
3. 检查垃圾邮件文件夹

### 问题 3：加载速度慢

**优化方法**：
1. Tidio 会自动优化加载
2. 确保网络畅通
3. 考虑使用 CDN（Tidio 自带 CDN）

---

## 💰 费用说明

**免费版**（足够使用）：
- ✅ 3 个客服坐席
- ✅ 100 个聊天机器人触发/月
- ✅ 基础统计
- ✅ 手机 App
- ✅ 邮件集成

**付费版**（$29/月起）：
- 更多功能
- 无限聊天机器人
- 高级统计
- 优先支持

**对于刚起步的独立站，免费版完全够用！**

---

## 🆚 Tidio vs SaleSmartly

| 功能 | Tidio | SaleSmartly |
|------|-------|-------------|
| 注册难度 | ⭐ 简单（邮箱即可） | ⭐⭐⭐ 需要国外手机号 |
| 国内访问 | ✅ 可以直接访问 | ⚠️ 可能需要 VPN |
| 中文界面 | ✅ 有 | ✅ 有 |
| WhatsApp | ✅ 可集成 | ✅ 原生支持 |
| 免费版 | ✅ 功能够用 | ✅ 有限 |
| 稳定性 | ✅ 很稳定 | ✅ 稳定 |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## ✅ 完成检查清单

- [ ] 用邮箱注册了 Tidio
- [ ] 验证了邮箱
- [ ] 获取了 Public Key
- [ ] 填入了 `.env` 文件
- [ ] 重启了开发服务器
- [ ] 网站显示聊天按钮
- [ ] 测试发送了消息
- [ ] 下载了手机 App
- [ ] 设置了欢迎语
- [ ] 配置了工作时间

全部完成后，客户就可以通过网站聊天联系你了！🎉

---

## 📞 需要帮助？

- Tidio 官方文档：https://help.tidio.com
- Tidio 支持：support@tidio.com
- 或在 Tidio 仪表板点击右下角的聊天图标

有任何问题随时问我！
