/**
 * 离线消息队列管理器
 * 功能：
 * 1. 离线时保存消息到 IndexedDB
 * 2. 网络恢复后自动发送
 * 3. 显示发送状态
 * 4. 支持重试机制
 */

class OfflineMessageQueue {
    constructor() {
        this.dbName = 'ChatOfflineQueue';
        this.storeName = 'messages';
        this.db = null;
        this.isOnline = navigator.onLine;
        this.pendingMessages = [];
        this.syncInProgress = false;
        
        this.init();
    }

    /**
     * 初始化 IndexedDB
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => {
                console.error('[OfflineQueue] Failed to open database');
                reject(request.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('[OfflineQueue] Database initialized');
                this.loadPendingMessages();
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // 创建消息存储
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { 
                        keyPath: 'id',
                        autoIncrement: true 
                    });
                    
                    // 创建索引
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('status', 'status', { unique: false });
                    store.createIndex('chatId', 'chatId', { unique: false });
                }
            };
        });
    }

    /**
     * 加载待发送的消息
     */
    async loadPendingMessages() {
        try {
            const messages = await this.getAllMessages();
            this.pendingMessages = messages.filter(msg => msg.status === 'pending');
            console.log(`[OfflineQueue] Loaded ${this.pendingMessages.length} pending messages`);
            
            // 如果在线且有待发送消息，立即同步
            if (this.isOnline && this.pendingMessages.length > 0) {
                this.syncMessages();
            }
        } catch (error) {
            console.error('[OfflineQueue] Load pending messages error:', error);
        }
    }

    /**
     * 添加消息到队列
     */
    async addMessage(messageData) {
        const message = {
            ...messageData,
            status: 'pending',
            createdAt: Date.now(),
            retryCount: 0,
            maxRetries: 3
        };

        try {
            await this.saveMessage(message);
            this.pendingMessages.push(message);
            
            console.log('[OfflineQueue] Message added to queue:', message.id);
            
            // 如果在线，立即尝试发送
            if (this.isOnline) {
                this.syncMessages();
            } else {
                this.showOfflineNotification();
            }
            
            return message;
        } catch (error) {
            console.error('[OfflineQueue] Add message error:', error);
            throw error;
        }
    }

    /**
     * 保存消息到 IndexedDB
     */
    saveMessage(message) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(message);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 更新消息状态
     */
    updateMessageStatus(id, status, error = null) {
        return new Promise(async (resolve, reject) => {
            try {
                const message = await this.getMessageById(id);
                if (!message) {
                    reject(new Error('Message not found'));
                    return;
                }

                message.status = status;
                if (error) {
                    message.error = error;
                }
                if (status === 'sent') {
                    message.sentAt = Date.now();
                }

                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(message);

                request.onsuccess = () => {
                    console.log(`[OfflineQueue] Message ${id} status updated to ${status}`);
                    resolve();
                };
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 获取单个消息
     */
    getMessageById(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 获取所有消息
     */
    getAllMessages() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 删除已发送的消息
     */
    deleteMessage(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log(`[OfflineQueue] Message ${id} deleted`);
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 同步消息（发送到服务器）
     */
    async syncMessages() {
        if (this.syncInProgress || !this.isOnline || this.pendingMessages.length === 0) {
            return;
        }

        this.syncInProgress = true;
        console.log(`[OfflineQueue] Syncing ${this.pendingMessages.length} messages...`);

        // 按时间顺序发送
        const sortedMessages = [...this.pendingMessages].sort((a, b) => a.createdAt - b.createdAt);

        for (const message of sortedMessages) {
            try {
                await this.sendMessageToServer(message);
                await this.updateMessageStatus(message.id, 'sent');
                await this.deleteMessage(message.id);
                
                // 从待发送列表中移除
                this.pendingMessages = this.pendingMessages.filter(m => m.id !== message.id);
                
                console.log(`[OfflineQueue] Message ${message.id} sent successfully`);
                
                // 通知 UI 更新
                this.notifyMessageSent(message);
                
            } catch (error) {
                console.error(`[OfflineQueue] Failed to send message ${message.id}:`, error);
                
                message.retryCount++;
                
                if (message.retryCount >= message.maxRetries) {
                    await this.updateMessageStatus(message.id, 'failed', error.message);
                    this.notifyMessageFailed(message, error.message);
                } else {
                    await this.updateMessageStatus(message.id, 'pending');
                }
            }
        }

        this.syncInProgress = false;
        console.log('[OfflineQueue] Sync completed');
    }

    /**
     * 发送消息到服务器
     */
    async sendMessageToServer(message) {
        // 这里需要根据实际的 API 调整
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: message.to,
                content: message.content,
                isFile: message.isFile || false,
                fileUrl: message.fileUrl || null,
                fileName: message.fileName || null,
                fileType: message.fileType || null
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * 通知 UI 消息已发送
     */
    notifyMessageSent(message) {
        // 触发自定义事件，让 UI 更新
        window.dispatchEvent(new CustomEvent('offlineMessageSent', {
            detail: { message }
        }));
    }

    /**
     * 通知 UI 消息发送失败
     */
    notifyMessageFailed(message, error) {
        window.dispatchEvent(new CustomEvent('offlineMessageFailed', {
            detail: { message, error }
        }));
    }

    /**
     * 显示离线通知
     */
    showOfflineNotification() {
        const notification = document.createElement('div');
        notification.className = 'offline-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="icon">📴</span>
                <span class="text">离线模式 - 消息将在网络恢复后发送</span>
                <span class="count">${this.pendingMessages.length}</span>
            </div>
        `;
        
        // 检查是否已有通知
        const existing = document.querySelector('.offline-notification');
        if (existing) {
            existing.querySelector('.count').textContent = this.pendingMessages.length;
            return;
        }
        
        document.body.appendChild(notification);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * 获取待发送消息数量
     */
    getPendingCount() {
        return this.pendingMessages.length;
    }

    /**
     * 监听网络状态变化
     */
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            console.log('[OfflineQueue] Network online');
            this.isOnline = true;
            this.hideOfflineIndicator();
            this.syncMessages();
        });

        window.addEventListener('offline', () => {
            console.log('[OfflineQueue] Network offline');
            this.isOnline = false;
            this.showOfflineIndicator();
        });
    }

    /**
     * 显示离线指示器
     */
    showOfflineIndicator() {
        let indicator = document.getElementById('offline-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.innerHTML = `
                <div class="indicator-content">
                    <span class="dot"></span>
                    <span class="text">离线</span>
                    <span class="pending-count" id="pending-count">0</span>
                </div>
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.classList.add('show');
        this.updatePendingCount();
    }

    /**
     * 隐藏离线指示器
     */
    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.classList.remove('show');
        }
    }

    /**
     * 更新待发送数量显示
     */
    updatePendingCount() {
        const countElement = document.getElementById('pending-count');
        if (countElement) {
            countElement.textContent = this.pendingMessages.length;
        }
    }

    /**
     * 清除所有待发送消息
     */
    async clearAll() {
        try {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            await store.clear();
            
            this.pendingMessages = [];
            console.log('[OfflineQueue] All messages cleared');
        } catch (error) {
            console.error('[OfflineQueue] Clear all error:', error);
        }
    }
}

// 创建全局实例
window.offlineQueue = new OfflineMessageQueue();

// 初始化网络监听
window.offlineQueue.setupNetworkListeners();

console.log('[OfflineQueue] Module loaded');
