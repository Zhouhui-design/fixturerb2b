# SaleSmartly 快速开始 - 3 步完成集成

## ⚡ 超快配置（5 分钟）

### 第 1 步：注册并获取 Project ID（2 分钟）

1. 访问：https://www.salesmartly.com
2. 注册账号
3. 创建项目 `fixturerb2b.top`
4. 复制 **Project ID**（在 设置 → 项目设置）

### 第 2 步：配置到项目（1 分钟）

编辑 `.env` 文件：

```bash
nano .env
```

添加这一行（替换为你的实际 Project ID）：

```env
VITE_SALESMARTLY_PROJECT_ID=123456
```

保存后重启服务器：

```bash
npm run dev
```

### 第 3 步：测试（2 分钟）

1. 打开 http://localhost:8090
2. 看右下角是否有聊天按钮
3. 点击测试发送消息
4. 在 SaleSmartly 仪表板查看是否收到

---

## 📱 配置 WhatsApp（最重要！）

1. 登录 SaleSmartly 仪表板
2. 点击"渠道管理"
3. 选择"WhatsApp"
4. 用手机 WhatsApp 扫码
5. 完成绑定

现在客户发 WhatsApp，你就能在 SaleSmartly App 收到了！

---

## 🎯 必须做的配置

### 1. 设置欢迎语

```
您好！欢迎来到 fixturerb2b.top 👋

我们提供：
✅ OEM/ODM 代工
✅ 图纸到实物 1:1 还原  
✅ 无最小起订量

请问有什么可以帮助您的？
```

### 2. 配置工作时间

- 周一到周五：9:00 - 18:00 (GMT+8)
- 周六：9:00 - 12:00
- 周日：休息

### 3. 下载手机 App

- iOS: App Store 搜 "SaleSmartly"
- Android: Google Play 搜 "SaleSmartly"

---

## ✅ 完成检查清单

- [ ] 注册了 SaleSmartly 账号
- [ ] 创建了项目
- [ ] 获取了 Project ID
- [ ] 填入了 `.env` 文件
- [ ] 网站显示聊天按钮
- [ ] 绑定了 WhatsApp
- [ ] 下载了手机 App
- [ ] 设置了欢迎语
- [ ] 测试发送和接收消息

全部完成后，你就可以随时随地接收客户咨询了！🚀
