# PWA 快速测试指南

## 🧪 测试步骤

### 1. 验证 Manifest

打开浏览器开发者工具（F12），在 Console 中运行：

```javascript
fetch('/manifest.json')
  .then(r => r.json())
  .then(data => console.log('Manifest:', data));
```

**预期结果**：显示 manifest 内容，包含 name、icons 等字段

---

### 2. 检查 Service Worker

在 Console 中运行：

```javascript
navigator.serviceWorker.getRegistration()
  .then(reg => {
    if (reg) {
      console.log('✅ SW registered:', reg.scope);
      console.log('SW state:', reg.active?.state);
    } else {
      console.log('❌ SW not registered');
    }
  });
```

**预期结果**：显示 "✅ SW registered"

---

### 3. 查看缓存

在 Application 标签页（Chrome）：
1. 左侧选择 "Cache Storage"
2. 查看是否有 `static-v1` 和 `dynamic-v1`
3. 点击可查看缓存的文件列表

**预期结果**：看到缓存的 HTML、CSS、JS、图片文件

---

### 4. 测试离线模式

1. 在 Network 标签页，勾选 "Offline"
2. 刷新页面
3. 应该能看到缓存的页面

**预期结果**：页面正常显示，顶部出现红色离线提示

---

### 5. 测试安装提示

#### Desktop (Chrome/Edge)
- 地址栏右侧应显示安装图标（📥）
- 点击可安装应用

#### Android (Chrome)
- 访问网站 3 秒后，底部显示安装提示条
- 点击"安装"按钮

#### iOS (Safari)
- 点击分享按钮
- 选择"添加到主屏幕"

---

### 6. 验证图标

检查以下 URL 是否返回正确的图标：
- https://chat.fixr2026.com/images/icon-192.png
- https://chat.fixr2026.com/images/icon-512.png

**预期结果**：显示渐变色背景 + "FC" 文字的图标

---

## 🐛 常见问题排查

### Service Worker 未注册

**可能原因**：
1. HTTPS 配置问题
2. sw.js 路径错误
3. 浏览器不支持

**解决方法**：
```bash
# 检查 HTTPS
curl -I https://chat.fixr2026.com/sw.js

# 查看 Nginx 日志
ssh root@139.59.108.156
tail -f /var/log/nginx/error.log
```

### 缓存不工作

**检查项**：
1. Service Worker 是否正确激活
2. Cache-Control 头是否正确
3. 是否清除了旧缓存

**强制清除缓存**：
```javascript
// 在 Console 中运行
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
  console.log('All caches cleared');
});
```

### 安装提示不显示

**检查项**：
1. manifest.json 是否有效
2. 是否有 192x192 和 512x512 图标
3. 是否通过 HTTPS 访问
4. 用户之前是否关闭过提示

---

## 📱 真机测试

### Android 测试

1. **设备要求**：Android 5.0+，Chrome 浏览器
2. **测试步骤**：
   - 访问 https://chat.fixr2026.com
   - 等待安装提示出现
   - 点击"安装"
   - 在主屏幕找到图标
   - 点击打开，验证功能

3. **验证点**：
   - ✅ 图标正确显示
   - ✅ 无浏览器地址栏
   - ✅ 离线时可访问
   - ✅ 推送通知正常

### iOS 测试

1. **设备要求**：iOS 11.3+，Safari 浏览器
2. **测试步骤**：
   - 用 Safari 访问网站
   - 点击分享按钮
   - 选择"添加到主屏幕"
   - 确认添加
   - 从主屏幕打开

3. **验证点**：
   - ✅ 图标正确显示
   - ✅ 全屏模式
   - ⚠️ 推送通知受限（iOS 限制）
   - ✅ 离线缓存工作

---

## 📊 性能测试

### Lighthouse 审计

1. 打开 Chrome DevTools
2. 切换到 "Lighthouse" 标签
3. 选择 "Progressive Web App"
4. 点击 "Analyze page load"

**目标分数**：
- PWA: ≥ 90
- Performance: ≥ 80
- Best Practices: ≥ 90

### 关键指标

| 指标 | 目标值 | 当前值 |
|------|--------|--------|
| First Contentful Paint | < 1.5s | _待测_ |
| Time to Interactive | < 3.5s | _待测_ |
| Speed Index | < 3.4s | _待测_ |
| Offline support | Yes | ✅ |
| Installable | Yes | ✅ |

---

## ✅ 测试清单

### 基础功能
- [ ] Manifest 加载成功
- [ ] Service Worker 注册成功
- [ ] 图标正确显示
- [ ] 主题颜色应用

### 安装功能
- [ ] Desktop 可安装
- [ ] Android 可安装
- [ ] iOS 可添加到主屏幕
- [ ] 安装后独立运行

### 缓存功能
- [ ] 静态资源被缓存
- [ ] 离线页面可访问
- [ ] API 请求有 fallback
- [ ] 缓存更新正常

### 用户体验
- [ ] 加载速度快
- [ ] 离线提示清晰
- [ ] 安装流程简单
- [ ] 无控制台错误

### 兼容性
- [ ] Chrome Desktop
- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Firefox

---

## 🔍 调试技巧

### 查看 Service Worker 日志

```javascript
// 在 sw.js 中添加
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
});

// 从页面发送消息
navigator.serviceWorker.controller.postMessage('test');
```

### 模拟慢速网络

1. 打开 Network 标签
2. 选择 "Slow 3G" 或 "Fast 3G"
3. 刷新页面
4. 观察加载过程

### 监控缓存使用

```javascript
// 定期检查缓存大小
setInterval(async () => {
  const estimate = await navigator.storage.estimate();
  console.log('Storage used:', (estimate.usage / 1024 / 1024).toFixed(2), 'MB');
}, 10000);
```

---

## 📝 测试报告模板

```markdown
## PWA 测试报告

**测试日期**: YYYY-MM-DD
**测试人员**: ___________
**测试设备**: ___________

### 测试结果

| 测试项 | 状态 | 备注 |
|--------|------|------|
| Manifest | ✅/❌ | |
| Service Worker | ✅/❌ | |
| 安装功能 | ✅/❌ | |
| 离线访问 | ✅/❌ | |
| 缓存更新 | ✅/❌ | |

### 发现的问题

1. ________________
2. ________________

### 建议

____________________
____________________
```

---

**创建时间**: 2026-05-02  
**适用版本**: v1.0  
**下次更新**: 根据功能迭代
