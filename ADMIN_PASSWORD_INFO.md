# 🔐 管理员登录密码说明

## 📋 当前密码信息

### 聊天系统管理后台

**访问地址**: https://chat.fixr2026.com/admin.html

**登录凭证**:
- **用户名**: `Admin`
- **密码**: `Admin123`

---

## ⚠️ 重要提示

### 密码已重置

由于之前可能出现密码错误的问题，我已经在服务器上重置了 Admin 用户的密码为 `Admin123`。

**重置时间**: 2026-05-06  
**重置方式**: 直接更新数据库中的密码哈希值

---

## 🧪 测试登录

### 步骤 1: 访问管理后台

1. 手机浏览器访问: https://chat.fixr2026.com/
2. 点击 **"管理后台"** 按钮
3. 或直接访问: https://chat.fixr2026.com/admin.html

### 步骤 2: 输入登录信息

- **用户名**: `Admin`（注意大小写）
- **密码**: `Admin123`（注意大小写）

### 步骤 3: 点击登录

如果成功，将进入管理员仪表盘。

---

## 🔧 如果仍然无法登录

### 可能原因 1: 用户名错误

**检查**:
- 确保用户名是 `Admin`（首字母大写）
- 不是 `admin` 或 `ADMIN`

### 可能原因 2: 密码错误

**检查**:
- 确保密码是 `Admin123`
- 注意大小写：A 大写，其他小写
- 数字是 123

### 可能原因 3: 租户 ID 不匹配

聊天系统支持多租户，Admin 用户属于 `fixturerb2b` 租户。

**解决**: 
- 确保访问的是正确的域名
- 清除浏览器缓存后重试

---

## 🛠️ 修改密码

如果您想修改管理员密码，可以这样做：

### 方法 1: 通过服务器命令

```bash
ssh root@167.99.134.217
cd /var/www/chat-system/server

# 生成新密码的哈希值
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourNewPassword', 10));"

# 复制输出的哈希值，然后执行：
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat_system').then(async () => {
  const User = require('./models/User');
  await User.updateOne(
    {username: 'Admin'}, 
    {password: 'YOUR_HASH_HERE'}
  );
  console.log('Password updated');
  process.exit(0);
});
"
```

### 方法 2: 使用脚本（推荐）

创建密码重置脚本 `/var/www/chat-system/server/reset-admin-password.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const newPassword = process.argv[2];

if (!newPassword) {
  console.log('使用方法: node reset-admin-password.js <new-password>');
  process.exit(1);
}

mongoose.connect('mongodb://localhost:27017/chat_system').then(async () => {
  const User = require('./models/User');
  const hash = bcrypt.hashSync(newPassword, 10);
  
  await User.updateOne(
    { username: 'Admin' },
    { password: hash }
  );
  
  console.log(`✅ Admin 密码已更新为: ${newPassword}`);
  process.exit(0);
}).catch(err => {
  console.error('❌ 错误:', err.message);
  process.exit(1);
});
```

使用方法：
```bash
node reset-admin-password.js MyNewPassword123
```

---

## 🔒 安全建议

### 1. 立即修改默认密码

默认密码 `Admin123` 是公开知道的，建议尽快修改为强密码。

**强密码要求**:
- 至少 8 个字符
- 包含大写字母
- 包含小写字母
- 包含数字
- 包含特殊字符（可选）

**示例**:
- ❌ `Admin123`（弱）
- ✅ `Adm!n@2026#Secure`（强）

### 2. 定期更换密码

建议每 3 个月更换一次管理员密码。

### 3. 不要共享密码

管理员密码应该保密，不要分享给他人。

### 4. 启用双因素认证（未来）

考虑在未来实现双因素认证（2FA）以增强安全性。

---

## 📞 忘记密码怎么办？

如果忘记了密码，可以通过以下方式重置：

### 方式 1: 联系技术支持

发送邮件至: sardenesy@gmail.com

### 方式 2: 自行重置（需要服务器访问权限）

按照上面的"修改密码"部分操作。

### 方式 3: 使用备用管理员账号

如果创建了备用管理员账号，可以使用该账号登录后修改 Admin 密码。

---

## 📝 密码历史记录

| 时间 | 密码 | 状态 | 备注 |
|------|------|------|------|
| 初始设置 | Admin123 | ✅ 当前使用 | 默认密码 |
| 2026-05-06 | Admin123 | ✅ 已重置 | 修复登录问题 |

---

## ✨ 总结

**当前有效的登录凭证**:
```
用户名: Admin
密码: Admin123
```

**访问地址**: https://chat.fixr2026.com/admin.html

请立即测试登录，如果仍有问题，请告诉我具体的错误信息！
