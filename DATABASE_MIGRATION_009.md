# Supabase 数据库迁移执行说明

## 迁移文件：009_contact_submissions_customer_view.sql

此迁移文件为询盘管理系统优化数据库性能。

### 执行步骤：

#### 方法 1：使用 Supabase Dashboard（推荐）

1. 登录 Supabase Dashboard：https://supabase.com/dashboard
2. 选择项目：`yaumblbimxrunltqadsq`
3. 进入 **SQL Editor**
4. 点击 **New Query**
5. 复制并粘贴 `supabase/migrations/009_contact_submissions_customer_view.sql` 的内容
6. 点击 **Run** 执行

#### 方法 2：使用 Supabase CLI

```bash
# 如果已安装 Supabase CLI
cd /home/sardenesy/projects/fixturerb2b
supabase db push
```

### 迁移内容：

1. **创建索引** - 优化 name + email 联合查询性能
   ```sql
   CREATE INDEX idx_contact_submissions_name_email ON contact_submissions(name, email);
   ```

2. **安全说明**：
   - 管理员仪表板 (`/admin`)：需要 Supabase 认证，使用现有的 authenticated 策略
   - 客户查询页面 (`/my-inquiries`)：应用层过滤，只显示匹配 name+email 的记录

### 验证迁移成功：

在 Supabase SQL Editor 中执行：

```sql
-- 检查索引是否创建
SELECT indexname FROM pg_indexes WHERE tablename = 'contact_submissions';

-- 应该看到 idx_contact_submissions_name_email
```

### 功能说明：

#### 1. 管理员视图 (/admin)
- 路径：`https://fixr2026.com/admin`
- 功能：查看所有询盘记录
- 安全：邮箱和电话自动脱敏（例如：`jo****@example.com`，`13****89`）
- 需要：Supabase 认证用户

#### 2. 客户查询 (/my-inquiries)
- 路径：`https://fixr2026.com/my-inquiries`
- 功能：客户通过姓名+邮箱查询自己的询盘历史
- 安全：应用层过滤，只返回匹配的記錄
- 脱敏：邮箱和电话部分隐藏

### 访问控制矩阵：

| 用户类型 | 查看权限 | 脱敏处理 |
|---------|---------|---------|
| 管理员（已认证） | 所有记录 | 邮箱和电话用 * 脱敏 |
| 客户（public） | 仅自己的记录 | 邮箱和电话用 * 脱敏 |
| 匿名访问 | 无 | - |

### 性能优化：

新增索引将大幅提升客户查询速度：
- 查询方式：`WHERE name = ? AND email = ?`
- 索引类型：复合索引 (name, email)
- 预期效果：查询时间从 ~100ms 降至 ~10ms

### 注意事项：

1. 此迁移不会修改现有数据
2. 不会影响现有的 INSERT 策略（任何人仍可提交表单）
3. 管理员需要登录 Supabase Auth 才能访问 `/admin`
4. 客户查询无需登录，但只能看到自己的数据
