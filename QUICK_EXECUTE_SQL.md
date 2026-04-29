# ⚡ 执行多语言SQL - 3步完成

## 📋 文件信息

**文件：** `supabase/migrations/008_complete_multilingual_translations.sql`  
**内容：** 8种语言的240+条翻译  
**预计时间：** 5分钟

---

## 🚀 3步执行

### 第1步：打开Supabase SQL编辑器

访问：
```
https://supabase.com/dashboard/project/yaumblbimxrunltqadsq/sql/new
```

---

### 第2步：复制并粘贴SQL

**方法A：手动复制**
1. 打开本地文件：`supabase/migrations/008_complete_multilingual_translations.sql`
2. 全选（Ctrl+A）
3. 复制（Ctrl+C）
4. 粘贴到Supabase SQL编辑器（Ctrl+V）

**方法B：命令行复制**
```bash
cat supabase/migrations/008_complete_multilingual_translations.sql | xclip -selection clipboard
```
然后粘贴到Supabase

---

### 第3步：执行SQL

1. 点击右上角 **"Run"** 按钮
2. 或按 **Ctrl+Enter**
3. 等待执行完成

✅ **成功标志：**
```
Success. No rows returned
```

---

## 🔍 验证结果

在SQL编辑器中运行：

```sql
SELECT language, COUNT(*) as count
FROM translations
GROUP BY language
ORDER BY language;
```

**应该看到：**
- ar: 30
- de: 30
- en: (已有数量)
- es: 30
- fr: 30
- ja: 30
- ko: 30
- pt: 30
- ru: 30
- zh: (已有数量)

---

## 🌐 测试网站

```bash
npm run dev
```

访问 http://localhost:8090，点击右上角Globe图标，切换不同语言测试。

---

## ✅ 完成标志

- [ ] SQL执行成功
- [ ] 查询显示8种新语言
- [ ] 网站可以切换语言
- [ ] 翻译显示正确

---

**详细指南：** [EXECUTE_MULTILINGUAL_SQL.md](file:///home/sardenesy/fixturerb2b/EXECUTE_MULTILINGUAL_SQL.md)

**开始执行吧！** 🚀
