# 🔧 邮件发送功能配置指南

## 概述

实现从管理后台直接发送邮件给客户的完整功能。

**技术栈**：
- **Resend**：邮件发送服务（免费 3000 封/月）
- **Supabase Edge Function**：服务器端邮件发送逻辑
- **Gmail**：发件邮箱（sardenesy@gmail.com）

---

##  配置步骤

### 第 1 步：注册 Resend 账号

1. 访问 https://resend.com
2. 点击 **Sign Up**
3. 使用 **Gmail 账号**（sardenesy@gmail.com）注册
4. 完成邮箱验证

### 第 2 步：获取 API Key

1. 登录 Resend Dashboard
2. 点击左侧菜单 **API Keys**
3. 点击 **Create API Key**
4. 填写信息：
   - **Name**: `fixturerb2b-admin`
   - **Permission**: ✅ Full Access
5. 点击 **Create API Key**
6. **立即复制 API Key**（格式：`re_xxxxxxxxxxxx`）

⚠️ **重要**：API Key 只会显示一次，请保存好！

### 第 3 步：配置环境变量

#### 在 Supabase Dashboard 配置 Edge Function 环境变量：

1. 访问 https://supabase.com/dashboard/project/yaumblbimxrunltqadsq
2. 点击左侧 **Edge Functions**
3. 找到 **reply-to-customer** 函数
4. 点击右侧的 **** 菜单 → **Edit Secrets**
5. 添加以下密钥：

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | `re_你的实际API密钥` |
| `FROM_EMAIL` | `sardenesy@gmail.com` |
| `FROM_NAME` | `Fixturerb2b Support` |

6. 点击 **Save Secrets**

#### 在本地 `.env` 文件配置（用于开发测试）：

打开 `/home/sardenesy/projects/fixturerb2b/.env`，添加：

```env
# Resend Email Service
VITE_RESEND_API_KEY=re_你的实际API密钥
VITE_FROM_EMAIL=sardenesy@gmail.com
```

### 第 4 步：部署 Edge Function

在终端执行：

```bash
cd /home/sardenesy/projects/fixturerb2b

# 部署 Edge Function
supabase functions deploy reply-to-customer

# 如果提示需要登录，先登录
supabase login
```

### 第 5 步：测试邮件发送

#### 方法 A：在管理后台测试

1. 访问 https://fixr2026.com/admin
2. 输入密码登录
3. 找到任意询盘记录
4. 点击 **Reply Email** 按钮
5. 填写邮件内容
6. 点击 **发送邮件**
7. 检查 Gmail 收件箱

#### 方法 B：使用 curl 测试

```bash
curl -X POST 'https://yaumblbimxrunltqadsq.supabase.co/functions/v1/reply-to-customer' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer 你的anon_key' \
  -d '{
    "to": "test@example.com",
    "subject": "测试邮件",
    "body": "这是一封测试邮件",
    "customerName": "测试客户"
  }'
```

---

## 🎨 邮件模板效果

发送的邮件将包含：

- ✅ **品牌头部**：Fixturerb2b Logo + 公司名称
- ✅ **客户称呼**：Dear [客户姓名]
- ✅ **邮件内容**：您填写的正文（保留格式）
- ✅ **签名档**：Fixturerb2b Team + 联系信息
- ✅ **品牌底部**：版权信息

邮件样式采用品牌色调（木纹色 #8b6914），专业美观。

---

## 🔄 自动标记状态

邮件发送成功后：
1. ✅ 自动将询盘状态更新为 **replied**
2. ✅ 在管理后台显示绿色 "Replied" 标签
3. ✅ 可在 Resend Dashboard 查看发送记录

---

## 🐛 故障排除

### 问题 1：点击发送后提示错误

**可能原因**：
- Edge Function 未部署
- API Key 配置错误
- 环境变量未保存

**解决方法**：
1. 检查 Edge Function 是否部署成功
2. 在 Supabase Dashboard 检查 Secrets 是否正确
3. 查看浏览器控制台的错误信息

### 问题 2：邮件发送成功但客户未收到

**可能原因**：
- 邮件进入垃圾箱
- 邮箱地址错误
- Resend 发送失败

**解决方法**：
1. 在 Resend Dashboard 查看发送状态
2. 让客户检查垃圾邮件文件夹
3. 检查邮箱地址是否正确

### 问题 3：如何查看发送记录？

**方法**：
1. 访问 https://resend.com/emails
2. 查看所有发送记录：
   - ✅ Sent（发送成功）
   - ❌ Failed（发送失败）
   - 📬 Bounced（退信）
   - 📊 打开率（需配置域名）

---

## 🚀 进阶配置（可选）

### 配置自定义域名发件

为了提高邮件可信度，建议配置域名发件：

1. 在 Resend Dashboard 点击 **Domains**
2. 点击 **Add Domain**
3. 输入 `fixr2026.com`
4. 按照提示配置 DNS 记录（SPF、DKIM、MX）
5. 等待 DNS 生效（10分钟 - 24小时）
6. 更新 Edge Function 的 `FROM_EMAIL` 为 `noreply@fixr2026.com`

**好处**：
- ✅ 邮件不易进入垃圾箱
- ✅ 品牌一致性更好
- ✅ 可以追踪邮件打开率

---

##  获取帮助

- **Resend 文档**：https://resend.com/docs
- **项目 GitHub**：https://github.com/Zhouhui-design/fixturerb2b
- **Supabase 文档**：https://supabase.com/docs/guides/functions

---

**配置完成后，您就可以在管理后台直接发送邮件给客户了！** 🎉
