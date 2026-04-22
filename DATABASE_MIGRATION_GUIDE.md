# 📋 数据库迁移指南 - 手动执行

由于 supabase-cli 二进制文件有问题，我们使用最简单的方法：**在 Supabase Dashboard 中直接执行 SQL**。

---

## ✅ 方法 1：Supabase Dashboard（推荐）

### 步骤：

1. **打开 Supabase Dashboard**
   - 访问：https://app.supabase.com
   - 登录你的账户

2. **选择你的项目**
   - 找到 `fixturerb2b` 项目
   - 点击进入

3. **进入 SQL Editor**
   - 左侧菜单点击 "SQL Editor"
   - 或者点击右上角的 "SQL" 图标

4. **复制 SQL 代码**
   
   打开文件 `supabase/migrations/005_create_quote_requests.sql`
   
   全选并复制所有内容

5. **粘贴并执行**
   - 在 SQL Editor 中粘贴代码
   - 点击右下角的 "Run" 按钮
   - 等待执行完成

6. **验证结果**
   
   应该看到类似这样的输出：
   ```
   Success. No rows returned
   ```

7. **检查表是否创建**
   
   运行以下查询验证：
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_name = 'quote_requests';
   ```
   
   应该返回：
   ```
   table_name
   ----------------
   quote_requests
   ```

---

## ✅ 方法 2：使用 psql 命令行（如果你有 PostgreSQL 客户端）

```bash
# 连接到你的 Supabase 数据库
psql -h yaumblbimxrunltqadsq.supabase.co \
     -p 5432 \
     -U postgres \
     -d postgres \
     -f supabase/migrations/005_create_quote_requests.sql
```

系统会提示你输入密码（从 Supabase Dashboard 获取）。

---

## ✅ 方法 3：修复 supabase-cli（高级用户）

如果你确实想使用 CLI：

```bash
# 1. 删除当前的 supabase-cli
rm supabase-cli

# 2. 重新下载正确的版本
curl -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar xz

# 3. 赋予执行权限
chmod +x supabase

# 4. 测试
./supabase --version

# 5. 执行迁移
./supabase db push
```

---

## 🔍 验证数据库表已创建

执行以下 SQL 查询来验证：

```sql
-- 1. 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'quote_requests';

-- 2. 查看表结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quote_requests'
ORDER BY ordinal_position;

-- 3. 检查索引
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'quote_requests';

-- 4. 检查 RLS 策略
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'quote_requests';
```

---

## 🎯 预期结果

执行成功后，你应该有：

✅ `quote_requests` 表已创建  
✅ 所有字段和索引已设置  
✅ RLS 策略已启用  
✅ 触发器已创建  

---

## 📊 测试插入数据

执行以下 SQL 测试插入一条记录：

```sql
INSERT INTO quote_requests (
  product_name,
  customer_name,
  customer_email,
  company_name,
  country,
  quantity
) VALUES (
  'Test Product',
  'Test User',
  'test@example.com',
  'Test Company',
  'United States',
  '100 pieces'
);

-- 验证插入
SELECT * FROM quote_requests WHERE customer_email = 'test@example.com';

-- 清理测试数据
DELETE FROM quote_requests WHERE customer_email = 'test@example.com';
```

---

## ❓ 常见问题

### Q: 看到 "permission denied" 错误？
**A:** 确保你使用的是项目的所有者账户或具有足够权限的用户。

### Q: 看到 "table already exists" 错误？
**A:** 表已经存在，这是正常的。你可以跳过这个迁移。

### Q: 如何查看完整的错误信息？
**A:** 在 SQL Editor 中，错误信息会显示在底部面板。截图发给我，我帮你解决。

---

## 🚀 下一步

数据库迁移完成后：

1. ✅ 重启开发服务器：`npm run dev`
2. ✅ 测试询价功能
3. ✅ 部署到生产环境

---

**推荐使用 方法 1（Supabase Dashboard），最简单可靠！**
