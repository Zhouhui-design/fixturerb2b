# 📧 邮件通知系统 - 完整配置指南

## ✅ 当前状态

- ✅ Edge Function 已部署：`send-email-notification`
- ✅ 数据库触发器 SQL 已准备
- ⏳ 等待配置 Resend API Key
- ⏳ 等待设置环境变量

---

## 🚀 快速配置（5 分钟）

### 第 1 步：注册 Resend（1 分钟）

1. 访问 https://resend.com
2. 点击 "Sign Up"
3. 使用邮箱注册
4. 验证邮箱

**免费额度：** 3,000 封/月（完全够用！）

---

### 第 2 步：获取 API Key（1 分钟）

1. 登录 Resend Dashboard
2. 点击左侧 "API Keys"
3. 点击 "Create API Key"
4. 输入名称：`fixturerb2b-notifications`
5. 点击 "Create"
6. **复制 API Key**（格式：`re_xxxxxxxxxxxx`）

⚠️ **重要：** API Key 只显示一次，请妥善保存！

---

### 第 3 步：设置环境变量（2 分钟）

#### 方法 A：使用脚本（推荐）

```bash
./setup-email-secrets.sh
```

按提示输入：
- Resend API Key
- 你的邮箱地址

#### 方法 B：手动在 Dashboard 中设置

1. 访问：https://supabase.com/dashboard/project/yaumblbimxrunltqadsq/settings/functions
2. 滚动到 "Environment variables"
3. 点击 "Add new variable"
4. 添加以下变量：

   ```
   Name: RESEND_API_KEY
   Value: re_your_api_key_here
   ```

   ```
   Name: ADMIN_EMAIL
   Value: your-email@example.com
   ```

5. 点击 "Save"

---

### 第 4 步：执行数据库迁移（1 分钟）

在 Supabase Dashboard 中：

1. 访问：https://supabase.com/dashboard/project/yaumblbimxrunltqadsq/sql/new
2. 打开文件 `supabase/migrations/007_create_email_webhook.sql`
3. 复制所有内容
4. 粘贴到 SQL Editor
5. 点击 "Run"

应该看到：
```
Success. No rows returned
```

---

## 🧪 测试邮件通知

### 测试步骤：

1. **提交测试询价**
   - 访问：http://localhost:8090/products/1
   - 点击 "Request a Quote"
   - 填写表单
   - 提交

2. **检查邮箱**
   - 等待 5-10 秒
   - 检查收件箱
   - 也应该检查垃圾邮件文件夹

3. **查看日志**
   - 访问：https://supabase.com/dashboard/project/yaumblbimxrunltqadsq/functions/logs
   - 查看 `send-email-notification` 函数的执行日志

---

## 📧 邮件内容预览

你会收到这样的邮件：

```
📋 New Quote Request

Customer Information
━━━━━━━━━━━━━━━━━━━━
Name: John Smith
Email: john@company.com
Company: ABC Corp
Country: United States
Phone: +1 555-123-4567

Product Details
━━━━━━━━━━━━━━━━━━━━
Product: Display Fixture Model X
Quantity: 100 pieces
Target Price: $50/unit
Specifications: Black color, steel frame

Trade Terms
━━━━━━━━━━━━━━━━━━━━
Delivery Terms: FOB
Payment Terms: T/T

Additional Message
━━━━━━━━━━━━━━━━━━━━
Please send catalog and price list.

Received: 2026-04-21 14:30:00

[View in Supabase Dashboard →]
```

---

## 🔧 故障排除

### 问题 1：没有收到邮件

**检查清单：**

1. ✅ Resend API Key 是否正确？
2. ✅ 环境变量是否已设置？
3. ✅ 数据库触发器是否创建成功？
4. ✅ 检查垃圾邮件文件夹
5. ✅ 查看 Edge Function 日志

**查看日志：**
```bash
./supabase-cli functions logs send-email-notification
```

### 问题 2：Edge Function 错误

**常见错误：**

- `RESEND_API_KEY not found` → 环境变量未设置
- `Invalid API key` → API Key 错误或已过期
- `Failed to send email` → Resend 账户问题

**解决方法：**
1. 检查环境变量
2. 重新部署函数
3. 联系 Resend 支持

### 问题 3：触发器未执行

**检查：**
```sql
-- 在 Supabase SQL Editor 中运行
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'trigger_quote_email_notification';
```

如果没有返回结果，重新执行 `007_create_email_webhook.sql`

---

## 🎯 高级配置

### 自定义发件人邮箱

如果你想使用自定义域名（如 `noreply@fixturerb2b.top`）：

1. 在 Resend 中添加域名
2. 配置 DNS 记录（DKIM, SPF）
3. 验证域名
4. 更新 Edge Function 中的 `from` 字段

### 发送给多个管理员

修改 Edge Function (`index.ts`)：

```typescript
const ADMIN_EMAILS = Deno.env.get('ADMIN_EMAILS')?.split(',') || ['admin@example.com']

// 在 emailData 中
to: ADMIN_EMAILS,
```

### 添加客户确认邮件

创建第二个 Edge Function 发送确认邮件给客户。

---

## 📊 监控和管理

### 查看发送统计

访问 Resend Dashboard：
- https://resend.com/emails
- 查看所有发送的邮件
- 查看打开率、点击率

### 查看 Edge Function 使用情况

访问 Supabase Dashboard：
- Project Settings → Functions
- 查看调用次数和错误率

### 成本控制

Resend 免费额度：
- 3,000 封/月
- 之后 $0.20/1000 封

对于 B2B 网站，这个用量通常足够！

---

## 🔄 替代方案：Zapier（无代码）

如果 Resend 配置太复杂，可以使用 Zapier：

### 步骤：

1. **注册 Zapier**
   - https://zapier.com

2. **创建 Zap**
   - Trigger: PostgreSQL (Supabase)
   - Action: Email (Gmail/Outlook)

3. **配置 Trigger**
   - Connect to Supabase
   - Table: `quote_requests`
   - Event: New Row

4. **配置 Action**
   - Choose email service
   - Compose email with data
   - Send to your email

5. **激活 Zap**

**优点：**
- ✅ 无需编程
- ✅ 可视化配置
- ✅ 支持多种邮件服务

**缺点：**
- ❌ 免费版限制 100 tasks/月
- ❌ 需要保持 Zapier 账户活跃

---

## ✅ 配置完成检查清单

- [ ] Resend 账户已注册
- [ ] API Key 已获取
- [ ] 环境变量已设置（RESEND_API_KEY, ADMIN_EMAIL）
- [ ] 数据库触发器已创建
- [ ] Edge Function 已部署
- [ ] 测试询价已提交
- [ ] 邮件已收到
- [ ] 日志已检查（无错误）

---

## 🎉 完成后

一旦配置完成，你将：

✅ 实时收到新询价通知  
✅ 快速响应潜在客户  
✅ 提高转化率  
✅ 专业的客户服务  

**祝你成功！** 🚀

有任何问题随时问我！
