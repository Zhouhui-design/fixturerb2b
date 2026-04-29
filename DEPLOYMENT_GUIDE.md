# 🚀 Production Deployment Guide

## ⚠️ IMPORTANT RULES (Must Follow)

### 1️⃣ Local Testing First (MANDATORY)
- ✅ ALL changes must be tested locally (`npm run dev`)
- ✅ Verify in browser before any production upload
- ❌ NEVER push untested code to production

### 2️⃣ New Features Workflow
- ✅ Develop locally → Test → Fix bugs → Final verification
- ✅ Only deploy after ALL tests pass
- ❌ No direct production development

### 3️⃣ Database Safety (CRITICAL)
- ✅ Backup before any schema changes
- ✅ Test migrations locally first
- ✅ Version control all migrations in Git
- ❌ NEVER run destructive SQL on production directly

### 4️⃣ Easy Content Management
- ✅ Store文案, images, videos in Supabase database
- ✅ Admin dashboard for non-technical updates
- ❌ NO hardcoded content in components

### 5️⃣ Contact Info Management
- ✅ Email, phone, address in database/config
- ✅ Admin panel for easy updates
- ❌ NO code changes needed for contact updates

---

## 📦 Current Deployment Status

**Build Status:** ✅ Production build ready  
**Location:** `/home/sardenesy/fixturerb2b/dist/`  
**Target:** `fixturerb2b.top` (Nginx at `/usr/share/nginx/html/`)

---

## 🚀 Deployment Methods

### Method 1: FileZilla (Recommended for Manual Upload)

1. **Open FileZilla**
   - Host: `sftp://fixturerb2b.top`
   - Username: `sardenesy`
   - Password: [your server password]
   - Port: 22

2. **Navigate:**
   - **Left (Local):** `/home/sardenesy/fixturerb2b/dist/`
   - **Right (Remote):** `/usr/share/nginx/html/`

3. **Upload:**
   - Select all files in dist/ folder
   - Drag to right panel
   - Click "Yes" to overwrite

4. **Verify:**
   - Visit https://fixturerb2b.top
   - Ctrl+Shift+R (hard refresh)
   - Test all features

---

### Method 2: Automated Script (If SSH Keys Work)

```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The script will:
- ✅ Build production files
- ✅ Create backup
- ✅ Upload to server
- ✅ Show verification steps

---

### Method 3: Git Push (If Using Vercel/Netlify)

```bash
# Add and commit changes
git add .
git commit -m "fix: [describe your fix]"

# Push to trigger auto-deploy
git push origin main
```

---

## ✅ Post-Deployment Verification Checklist

### Immediate Checks (0-5 minutes):
- [ ] Site loads without errors
- [ ] All pages navigate correctly
- [ ] Google Analytics tracking works (check Realtime)
- [ ] Forms submit correctly
- [ ] Mobile responsive works
- [ ] Images load properly

### Extended Checks (24-48 hours):
- [ ] Google Analytics shows page views
- [ ] No console errors in browser
- [ ] Quote requests being received
- [ ] SEO meta tags rendering correctly

---

## 🔄 Rollback Plan (If Issues Found)

### Quick Rollback:
```bash
# SSH to server
ssh sardenesy@fixturerb2b.top

# Restore from backup (if exists)
sudo cp /usr/share/nginx/html/index.html.backup /usr/share/nginx/html/index.html

# Or redeploy previous build
# Upload from: backups/prod_[timestamp]/
```

### Local Backup Locations:
- Server: `/usr/share/nginx/html/*.backup`
- Local: `backups/prod_[timestamp]/`

---

## ️ Common Issues & Solutions

### Issue: Site shows old version
**Solution:** 
- Clear browser cache (Ctrl+Shift+R)
- Clear CDN cache if using Cloudflare
- Check file upload completed successfully

### Issue: 404 errors on page refresh
**Solution:**
- Verify Nginx config has SPA fallback
- Check `location / { try_files $uri $uri/ /index.html; }`

### Issue: Google Analytics not tracking
**Solution:**
- View page source, search for `G-LWZXF5WGFB`
- Check script tag is before `</head>`
- Install GA Debugger Chrome extension
- Wait 5-10 minutes for data to appear

### Issue: Images not loading
**Solution:**
- Check image paths are correct
- Verify images uploaded to server
- Check file permissions (644)

---

## 📊 Database Backup Routine

### Weekly Backup:
```sql
-- Export all tables
SELECT * FROM translations;
SELECT * FROM quote_requests;
SELECT * FROM blog_posts;
SELECT * FROM products;
```

### Before Major Changes:
1. Go to Supabase Dashboard
2. Database → Backups → Create backup
3. Download SQL export
4. Store in secure location

---

## 🎯 Content Update Workflow

### For文案/Images/Videos:
1. Login to Admin Dashboard (when implemented)
2. Navigate to content section
3. Edit text or upload media
4. Preview changes
5. Publish (no code deployment needed)

### For Contact Info:
1. Admin Dashboard → Settings
2. Update email, phone, address
3. Save changes
4. Instant update across site

---

## 📝 Deployment Log Template

```
Date: YYYY-MM-DD
Deployed by: [Name]
Changes:
- [Feature/Bug fix description]
- [Files modified]
Testing:
- [ ] Local tests passed
- [ ] Browser verification complete
- [ ] GA tracking confirmed
Backup:
- Local: backups/prod_[timestamp]/
- Server: index.html.backup
Status: ✅ Success / ❌ Issues (describe)
```

---

## 🆘 Emergency Contacts

- **Developer:** [Your info]
- **Server Admin:** [If applicable]
- **Supabase Support:** https://supabase.com/docs
- **Nginx Docs:** https://nginx.org/en/docs/

---

**Remember: Local First, Test Thoroughly, Deploy Confidently! 🚀**
