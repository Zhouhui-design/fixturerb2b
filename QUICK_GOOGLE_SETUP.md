# ⚡ Google设置 - 快速开始

## 📝 你需要获取的信息

### 1️⃣ Google验证代码
从 **Google Search Console** 获取
格式：类似 `abc123def456ghi789`

### 2️⃣ Google Analytics ID  
从 **Google Analytics** 获取
格式：`G-XXXXXXXXXX`（G-加10个字符）

---

## 🔧 需要修改的文件

**文件：** `index.html`

### 修改1：替换验证代码

找到：
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />
```

改为：
```html
<meta name="google-site-verification" content="你的实际验证码" />
```

### 修改2：替换Analytics ID

找到所有 `G-XXXXXXXXXX`，改为你的实际ID，例如 `G-ABC123DEF4`

有3处需要改：
1. `<script async src="...id=G-XXXXXXXXXX"></script>`
2. `gtag('config', 'G-XXXXXXXXXX', {`

---

## 🚀 完成后执行

```bash
# 1. 构建
npm run build

# 2. 上传到服务器
scp dist/index.html sardenesy@fixturerb2b.top:/usr/share/nginx/html/

# 3. 回到Search Console点击"验证"
```

---

## 📋 完整指南

详细步骤请查看：
[GOOGLE_SETUP_GUIDE.md](file:///home/sardenesy/fixturerb2b/GOOGLE_SETUP_GUIDE.md)

---

## ✅ 验证成功标志

**Search Console:**
- ✅ 显示"所有权验证成功"
- ✅ 可以提交sitemap

**Analytics:**
- ✅ 实时报告显示活跃用户
- ✅ 可以看到页面浏览数据

---

**准备好了吗？现在就开始吧！** 🚀
