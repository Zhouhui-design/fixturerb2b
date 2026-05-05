# 📧 Resend 邮件服务配置指南

## 概述

本项目使用 **Resend** 作为邮件发送服务，支持从 Gmail 发送邮件。

**免费额度**：3,000 封邮件/月（足够日常管理使用）

---

## 步骤 1：注册 Resend 账号

### 1.1 访问 Resend 官网
```
https://resend.com
```

### 1.2 注册账号
1. 点击 "Sign Up" 按钮
2. 使用您的 **Gmail 账号**（sardenesy@gmail.com）注册
3. 完成邮箱验证

### 1.3 获取 API Key
1. 登录 Resend Dashboard
2. 点击左侧菜单 "API Keys"
3. 点击 "Create API Key"
4. 命名：`fixturerb2b-admin`
5. 权限选择：**Full Access**
6. 复制生成的 API Key（格式：`re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

⚠️ **重要**：API Key 只会显示一次，请立即保存！

---

## 步骤 2：添加发件域名（可选但推荐）

### 2.1 为什么要添加域名？
- 使用 Gmail 直接发送可能被标记为垃圾邮件
- 添加域名后，邮件可信度更高
- 可以使用 `noreply@fixr2026.com` 作为发件地址

### 2.2 添加域名步骤
1. 在 Resend Dashboard 点击 "Domains"
2. 点击 "Add Domain"
3. 输入域名：`fixr2026.com`
4. Resend 会生成 DNS 记录

### 2.3 配置 DNS 记录
在您的域名服务商（如阿里云、Cloudflare）添加以下 DNS 记录：

| 类型 | 名称 | 值 |
|------|------|-----|
| TXT | @ | v=spf1 include:resend.com ~all |
| MX | @ | feedback-smtp.us-east-1.amazonses.com (优先级 10) |
| TXT | resend._domainkey | k=rsa; p=...（Resend 提供的公钥） |

⚠️ **DNS 配置需要等待生效**：通常 10 分钟到 24 小时

---

## 步骤 3：配置项目环境变量

### 3.1 修改 `.env` 文件

打开项目根目录的 `.env` 文件，添加以下内容：

```env
# Resend Email Service Configuration
# 获取地址：https://resend.com/api-keys
VITE_RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 发件人邮箱
VITE_FROM_EMAIL=sardenesy@gmail.com

# 如果不配置域名，暂时使用 Gmail
# 配置域名后，可以改为：noreply@fixr2026.com
```

### 3.2 替换占位符
将 `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` 替换为您的真实 API Key。

---

## 步骤 4：验证配置

### 4.1 在 Supabase Dashboard 测试

1. 访问 https://supabase.com/dashboard/project/yaumblbimxrunltqadsq
2. 进入 "SQL Editor"
3. 运行以下测试查询：

```sql
-- 检查环境变量是否配置成功
SELECT current_setting('app.settings.from_email', true) as from_email;
```

### 4.2 本地测试（开发环境）

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问 http://localhost:5173/admin
3. 登录管理后台
4. 点击任意询盘的 "Reply Email"
5. 填写邮件内容并点击 "发送邮件"
6. 检查 Gmail 收件箱是否收到邮件

---

## 步骤 5：故障排除

### 问题 1：邮件发送失败
**可能原因**：
- API Key 不正确
- Gmail 账号未验证
- 网络问题

**解决方法**：
1. 检查 `.env` 文件中的 API Key 是否正确
2. 在 Resend Dashboard 查看发送日志
3. 检查浏览器控制台错误信息

### 问题 2：邮件进入垃圾箱
**可能原因**：
- 未配置 SPF/DKIM 记录
- Gmail 直接发送可信度低

**解决方法**：
1. 按照步骤 2 配置域名和 DNS 记录
2. 等待 DNS 生效
3. 在 Resend Dashboard 验证域名状态

### 问题 3：找不到 API Key
**解决方法**：
1. 重新访问 https://resend.com/api-keys
2. 如果之前的 Key 丢失，只能重新创建一个新的
3. 删除旧 Key，创建新 Key

---

## 步骤 6：日常使用

### 发送邮件
1. 访问 https://fixr2026.com/admin
2. 登录管理后台
3. 点击 "Reply Email" 按钮
4. 填写邮件内容
5. 点击 "发送邮件"
6. 系统自动标记为 "已回复"

### 查看发送状态
在 Resend Dashboard 的 "Emails" 页面可以查看所有发送记录：
- 发送成功
- 发送失败
- 退信
- 打开率（需配置域名）

---

## 安全建议

1. **保护 API Key**
   - `.env` 文件已在 `.gitignore` 中
   - 不要将 API Key 提交到 Git
   - 定期更换 API Key

2. **监控发送量**
   - 免费版每月 3,000 封
   - 在 Resend Dashboard 查看使用情况
   - 如需更多额度，可升级到付费版

3. **发件人设置**
   - 使用固定的发件人名称（如 "Fixturerb2b Support"）
   - 保持一致性，提高邮件可信度

---

## 联系支持

如有问题，请联系：
- Resend 官方文档：https://resend.com/docs
- 项目 GitHub Issues：https://github.com/Zhouhui-design/fixturerb2b/issues

---

**配置完成后，您就拥有了完整的邮件发送功能！🎉**
