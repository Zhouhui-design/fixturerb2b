# 离线消息队列快速测试指南

## 🧪 测试步骤

### 1. 验证 IndexedDB 初始化

打开浏览器控制台（F12），运行：

```javascript
// 检查数据库是否创建
indexedDB.open('ChatOfflineQueue').onsuccess = function(e) {
    const db = e.target.result;
    console.log('✅ Database opened');
    console.log('Object stores:', Array.from(db.objectStoreNames));
};
```

**预期结果**：显示 "✅ Database opened" 和 `['messages']`

---

### 2. 测试离线发送

#### 步骤：

1. **打开聊天页面**
   ```
   https://chat.fixr2026.com
   ```

2. **模拟离线**
   - Chrome: DevTools → Network → 勾选 "Offline"
   - Firefox: DevTools → Network → Work Offline

3. **发送消息**
   - 输入任意消息
   - 点击发送

4. **观察 UI**
   - ✅ 消息显示在聊天窗口
   - ✅ 状态图标为 ⏳（旋转）
   - ✅ 顶部出现红色离线条
   - ✅ 底部显示通知："离线模式"

5. **验证存储**
   ```javascript
   // Console 中运行
   window.offlineQueue.pendingMessages
   // 应显示包含刚才消息的数组
   ```

---

### 3. 测试网络恢复同步

#### 步骤：

1. **保持离线，发送多条消息**
   - 发送 3-5 条测试消息
   - 确认都显示 ⏳ 状态

2. **恢复网络**
   - 取消 "Offline" 勾选

3. **观察同步过程**
   - ✅ 红色离线条消失
   - ✅ 消息状态从 ⏳ 变为 ✓✓
   - ✅ 显示通知："离线消息已发送"
   - ✅ Console 显示同步日志

4. **验证清理**
   ```javascript
   window.offlineQueue.pendingMessages
   // 应为空数组 []
   ```

---

### 4. 测试页面刷新

#### 步骤：

1. **离线发送消息**
2. **刷新页面**（保持离线）
3. **检查**
   - ✅ 待发送消息仍然存在
   - ✅ 显示 ⏳ 状态
   - ✅ 离线条显示正确数量

4. **恢复网络**
   - ✅ 消息正常同步

---

### 5. 测试发送失败重试

#### 步骤：

1. **离线发送消息**
2. **修改 API 端点使其返回错误**（临时测试）
   ```javascript
   // 在 offline-queue.js 中临时修改
   async sendMessageToServer(message) {
       throw new Error('Test error');
   }
   ```

3. **恢复网络并触发同步**
4. **观察**
   - ✅ 自动重试 3 次
   - ✅ Console 显示重试日志
   - ✅ 3次后状态变为 ✗
   - ✅ 显示错误通知

5. **测试手动重试**
   - 点击 ✗ 图标
   - ✅ 消息重新发送

6. **恢复正常的 API**

---

### 6. 测试 Service Worker 后台同步

#### 步骤：

1. **注册 Background Sync**
   ```javascript
   // Console 中运行
   navigator.serviceWorker.ready.then(reg => {
       return reg.sync.register('sync-messages');
   }).then(() => {
       console.log('✅ Background sync registered');
   });
   ```

2. **离线发送消息**
3. **关闭浏览器标签**
4. **恢复网络**
5. **重新打开页面**
6. **检查**
   - ✅ Console 显示 "[SW] Syncing offline messages..."
   - ✅ 消息已同步

**注意**：Background Sync 仅在 Chrome/Edge 完全支持

---

## 📊 性能测试

### 大量消息测试

```javascript
// 批量添加测试消息
async function testBulkMessages() {
    console.time('Add 100 messages');
    
    for (let i = 0; i < 100; i++) {
        await window.offlineQueue.addMessage({
            to: 'test',
            content: `Test message ${i}`,
            chatId: 'test'
        });
    }
    
    console.timeEnd('Add 100 messages');
    console.log('Pending count:', window.offlineQueue.getPendingCount());
}

testBulkMessages();
```

**预期结果**：
- 添加 100 条消息 < 2秒
- 内存增加 < 10MB

---

## 🔍 调试技巧

### 查看 IndexedDB 内容

```javascript
// 方法 1: 使用 DevTools
// Application → IndexedDB → ChatOfflineQueue → messages

// 方法 2: 编程方式
const request = indexedDB.open('ChatOfflineQueue');
request.onsuccess = function(e) {
    const db = e.target.result;
    const tx = db.transaction(['messages'], 'readonly');
    const store = tx.objectStore('messages');
    
    store.getAll().onsuccess = function(e) {
        console.table(e.target.result);
    };
};
```

### 监控网络事件

```javascript
window.addEventListener('online', () => {
    console.log('🟢 Network online at', new Date().toISOString());
});

window.addEventListener('offline', () => {
    console.log('🔴 Network offline at', new Date().toISOString());
});
```

### 跟踪同步过程

```javascript
// 在 offline-queue.js 中添加日志
const originalSync = window.offlineQueue.syncMessages.bind(window.offlineQueue);
window.offlineQueue.syncMessages = async function() {
    console.log('[Debug] Starting sync...');
    console.log('[Debug] Pending messages:', this.pendingMessages.length);
    
    const result = await originalSync();
    
    console.log('[Debug] Sync completed');
    console.log('[Debug] Remaining pending:', this.pendingMessages.length);
    
    return result;
};
```

---

## 🐛 常见问题排查

### 问题 1: IndexedDB 未初始化

**症状**：控制台报错 "Cannot read property 'transaction' of null"

**原因**：数据库尚未打开

**解决**：
```javascript
// 等待初始化完成
await window.offlineQueue.init();
console.log('Database ready');
```

### 问题 2: 消息未保存到 IndexedDB

**症状**：离线发送后，pendingMessages 为空

**检查**：
1. 控制台是否有错误
2. IndexedDB 权限是否被禁用
3. 是否在隐私模式

**解决**：
```javascript
// 检查浏览器支持
if (!('indexedDB' in window)) {
    alert('您的浏览器不支持离线功能');
}
```

### 问题 3: 同步不触发

**症状**：网络恢复后，消息仍然显示 ⏳

**检查**：
1. online 事件是否触发
2. syncMessages 方法是否调用
3. 网络请求是否成功

**调试**：
```javascript
// 手动触发
window.addEventListener('online', () => {
    console.log('Online event fired');
    window.offlineQueue.syncMessages();
});
```

### 问题 4: 重复消息

**症状**：同一条消息出现多次

**原因**：同步逻辑有 bug

**解决**：
```javascript
// 检查 syncInProgress 标志
console.log('Sync in progress:', window.offlineQueue.syncInProgress);

// 确保消息发送后立即删除
await this.deleteMessage(message.id);
```

---

## 📱 移动端测试

### iOS Safari

1. **添加到主屏幕**
2. **断开 WiFi**
3. **发送消息**
4. **连接 WiFi**
5. **观察同步**

**注意**：iOS 不支持 Background Sync

### Android Chrome

1. **启用 USB 调试**
2. **连接电脑**
3. **chrome://inspect**
4. **远程调试**
5. **执行上述测试**

---

## ✅ 测试清单

### 基础功能
- [ ] IndexedDB 初始化成功
- [ ] 离线消息保存正常
- [ ] 在线消息直接发送
- [ ] 网络恢复自动同步
- [ ] 消息状态正确更新

### UI 反馈
- [ ] 离线指示器显示
- [ ] 消息状态图标正确
- [ ] Toast 通知显示
- [ ] 动画效果流畅

### 边界情况
- [ ] 页面刷新后数据保留
- [ ] 大量消息处理正常
- [ ] 发送失败正确重试
- [ ] 手动重试工作正常

### 兼容性
- [ ] Chrome Desktop
- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Firefox

### 性能
- [ ] 写入速度 < 10ms/条
- [ ] 同步不阻塞 UI
- [ ] 内存占用合理
- [ ] 存储空间可控

---

## 📝 测试报告模板

```markdown
## 离线消息队列测试报告

**测试日期**: ___________
**测试人员**: ___________
**测试设备**: ___________
**浏览器版本**: ___________

### 测试结果

| 测试项 | 状态 | 备注 |
|--------|------|------|
| IndexedDB 初始化 | ✅/❌ | |
| 离线发送 | ✅/❌ | |
| 自动同步 | ✅/❌ | |
| UI 反馈 | ✅/❌ | |
| 重试机制 | ✅/❌ | |
| 页面刷新 | ✅/❌ | |
| 移动端 | ✅/❌ | |

### 性能指标

- 写入速度: _____ ms/条
- 同步时间: _____ s (_____ 条消息)
- 内存占用: _____ MB

### 发现的问题

1. ________________
2. ________________

### 建议

____________________
____________________
```

---

## 🎯 快速验证脚本

复制以下脚本到 Console 一键测试：

```javascript
(async function quickTest() {
    console.log('🧪 Starting offline queue test...\n');
    
    // Test 1: Check initialization
    console.log('Test 1: Database initialization');
    if (window.offlineQueue && window.offlineQueue.db) {
        console.log('✅ PASS\n');
    } else {
        console.log('❌ FAIL\n');
        return;
    }
    
    // Test 2: Add message
    console.log('Test 2: Add message to queue');
    try {
        const msg = await window.offlineQueue.addMessage({
            to: 'test',
            content: 'Test message',
            chatId: 'test'
        });
        console.log('✅ PASS, Message ID:', msg.id, '\n');
    } catch (e) {
        console.log('❌ FAIL:', e.message, '\n');
    }
    
    // Test 3: Check pending count
    console.log('Test 3: Check pending count');
    const count = window.offlineQueue.getPendingCount();
    if (count > 0) {
        console.log('✅ PASS, Count:', count, '\n');
    } else {
        console.log('❌ FAIL\n');
    }
    
    // Test 4: Clear all
    console.log('Test 4: Clear all messages');
    await window.offlineQueue.clearAll();
    const newCount = window.offlineQueue.getPendingCount();
    if (newCount === 0) {
        console.log('✅ PASS\n');
    } else {
        console.log('❌ FAIL\n');
    }
    
    console.log('🎉 All tests completed!');
})();
```

---

**创建时间**: 2026-05-02  
**适用版本**: v1.0  
**下次更新**: 根据功能迭代
