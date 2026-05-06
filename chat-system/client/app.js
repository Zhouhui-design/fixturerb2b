class ChatApp {
    constructor() {
        this.socket = null;
        this.currentUser = null;
        this.currentChat = null;
        this.translationEnabled = false;
        this.localStream = null;
        this.peerConnection = null;
        this.tenantId = null;
        this.debugLogs = [];
        this.rtcConfig = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
        
        // 设置全局引用
        window.chatApp = this;
        
        this.init();
    }
    
    // 添加调试日志
    log(message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;
        this.debugLogs.push(logEntry);
        
        console.log(logEntry, data || '');
        
        // 更新页面上的调试面板
        this.updateDebugPanel();
    }
    
    updateDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        const debugContent = document.getElementById('debug-content');
        
        if (debugPanel && debugContent) {
            debugPanel.style.display = 'block';
            debugContent.innerHTML = this.debugLogs.map(log => 
                `<div style="margin-bottom: 4px; padding: 2px 0; border-bottom: 1px solid #eee;">${log}</div>`
            ).join('');
            
            // 自动滚动到底部
            debugPanel.scrollTop = debugPanel.scrollHeight;
        }
    }
    
    clearDebugLogs() {
        this.debugLogs = [];
        this.updateDebugPanel();
    }
    
    init() {
        this.log('应用初始化开始');
        this.bindEvents();
        this.detectTenant();
        this.checkExistingSession();
        this.initTheme();
        this.setupClipboardPaste(); // 添加剪贴板粘贴支持
        
        // 初始化通话管理器（延迟初始化，等待 socket 连接）
        setTimeout(() => {
            if (this.socket) {
                this.callManager = new VoiceVideoCallManager(this);
                this.log('通话管理器初始化完成');
            }
        }, 1000);
        
        // 初始化翻译管理器
        this.translationManager = new TranslationManager();
        this.translationManager.initTranslationUI();
        this.log('翻译管理器初始化完成');
        
        this.log('应用初始化完成');
    }
    
    initTheme() {
        // 检查本地存储或系统偏好
        const savedTheme = localStorage.getItem('chat_theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
            const toggleBtn = document.getElementById('theme-toggle-btn');
            if (toggleBtn) toggleBtn.textContent = '☀️';
        }
        
        // 绑定切换按钮事件
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-mode');
        const toggleBtn = document.getElementById('theme-toggle-btn');
        
        if (toggleBtn) {
            toggleBtn.textContent = isDark ? '☀️' : '🌙';
        }
        
        localStorage.setItem('chat_theme', isDark ? 'dark' : 'light');
    }

    detectTenant() {
        const urlParams = new URLSearchParams(window.location.search);
        this.tenantId = urlParams.get('tenant') || 'fixturerb2b';
        
        const titles = {
            'fixturerb2b': 'Fixturerb2b 在线客服',
            'chinahuib2b': 'Chinahui B2B 客服'
        };
        document.title = titles[this.tenantId] || '在线客服';
        document.querySelector('h1').textContent = document.title;
    }
    
    bindEvents() {
        this.log('开始绑定事件');
        
        // 调试面板清除按钮
        const clearDebugBtn = document.getElementById('clear-debug-btn');
        if (clearDebugBtn) {
            clearDebugBtn.addEventListener('click', () => this.clearDebugLogs());
        }
        
        // 登录按钮 - 添加多重事件监听以兼容不同浏览器
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            this.log('找到登录按钮，开始绑定事件');
            
            // click 事件（桌面浏览器）
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.log('点击登录按钮 (click)');
                this.handleQuickLogin();
            });
            
            // touchend 事件（移动浏览器）
            loginBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.log('点击登录按钮 (touchend)');
                this.handleQuickLogin();
            }, { passive: false });
            
            // mousedown 事件（某些移动浏览器）
            loginBtn.addEventListener('mousedown', (e) => {
                this.log('登录按钮 mousedown 事件');
            });
            
            this.log('登录按钮事件绑定完成');
        } else {
            this.log('错误: 未找到登录按钮元素!');
            console.error('Login button not found!');
        }
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        document.getElementById('register-btn').addEventListener('click', () => this.showRegisterForm());
        document.getElementById('login-nav-btn').addEventListener('click', () => this.showLoginForm());
        document.getElementById('back-to-login').addEventListener('click', () => this.showLoginForm());
        
        document.getElementById('register-submit-btn').addEventListener('click', () => this.handleRegister());
        document.getElementById('login-nav-btn').addEventListener('click', () => this.showLoginForm());
        
        document.getElementById('search-user-input').addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        document.getElementById('send-message-btn').addEventListener('click', () => this.sendMessage());
        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        document.getElementById('translate-toggle-btn').addEventListener('click', () => this.toggleTranslation());
        document.getElementById('voice-message-btn').addEventListener('click', () => this.startVoiceRecording());
        document.getElementById('video-call-btn').addEventListener('click', () => this.startVideoCall());
        document.getElementById('end-call-btn').addEventListener('click', () => this.endVideoCall());
        document.getElementById('remark-btn').addEventListener('click', () => this.openRemarkModal());
        document.getElementById('social-links-btn').addEventListener('click', () => this.openSocialLinksModal());
        document.getElementById('suggestions-btn').addEventListener('click', () => this.openSuggestionsModal());
        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        document.getElementById('save-social-links-btn').addEventListener('click', () => this.saveSocialLinks());
        document.getElementById('submit-suggestion-btn').addEventListener('click', () => this.submitSuggestion());
        document.getElementById('save-remark-btn').addEventListener('click', () => this.saveRemark());
        
        // 文件上传事件
        const uploadBtn = document.getElementById('upload-file-btn');
        const fileInput = document.getElementById('file-input');
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        // 相册按钮事件
        const photoBtn = document.getElementById('upload-photo-btn');
        const photoInput = document.getElementById('photo-input');
        if (photoBtn && photoInput) {
            photoBtn.addEventListener('click', () => photoInput.click());
            photoInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        // 拍摄按钮事件
        const cameraBtn = document.getElementById('upload-camera-btn');
        const cameraInput = document.getElementById('camera-input');
        if (cameraBtn && cameraInput) {
            cameraBtn.addEventListener('click', () => cameraInput.click());
            cameraInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        // 麦克风录音事件
        this.setupVoiceRecording();
    }
    
    showRegisterForm() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('register-btn').classList.add('active');
        document.getElementById('login-nav-btn').classList.remove('active');
    }
    
    showLoginForm() {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('login-nav-btn').classList.add('active');
        document.getElementById('register-btn').classList.remove('active');
    }
    
    checkExistingSession() {
        const savedUser = localStorage.getItem('chat_user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                this.log(`发现保存的会话: ${userData.username}, isAdmin: ${userData.isAdmin || false}`);
                this.login(userData.username, userData.token, userData.isAdmin || false);
            } catch (e) {
                this.log(`解析保存的会话失败: ${e.message}`);
                localStorage.removeItem('chat_user');
            }
        } else {
            this.log('没有保存的会话');
        }
    }
    
    async handleQuickLogin() {
        this.log('handleQuickLogin 方法被调用');
        
        const usernameInput = document.getElementById('username-input');
        const errorDiv = document.getElementById('auth-error');
        
        if (!usernameInput) {
            this.log('错误: 未找到用户名输入框');
            alert('页面加载错误，请刷新重试');
            return;
        }
        
        const username = usernameInput.value.trim();
        
        this.log(`开始快捷登录，用户名: "${username}" (长度: ${username.length})`);
        
        if (!username) {
            this.log('错误: 用户名为空');
            if (errorDiv) {
                errorDiv.textContent = '称呼不能为空，请输入您的称呼';
                errorDiv.style.display = 'block';
            } else {
                alert('称呼不能为空');
            }
            return;
        }
        
        // 禁用按钮防止重复提交
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.textContent = '登录中...';
            this.log('登录按钮已禁用');
        }
        
        try {
            this.log(`发送注册请求到 /api/auth/register`);
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, tenantId: this.tenantId })
            });
            
            this.log(`收到响应，状态码: ${response.status}`);
            const data = await response.json();
            this.log(`响应数据:`, JSON.stringify(data));
            
            if (response.ok) {
                this.log(`登录成功，isAdmin: ${data.isAdmin || false}`);
                this.login(username, data.token, data.isAdmin || false);
                localStorage.setItem('chat_user', JSON.stringify({
                    userId: data.userId,
                    username: data.username,
                    token: data.token,
                    isAdmin: data.isAdmin || false
                }));
                this.log('用户信息已保存到 localStorage');
            } else {
                this.log(`登录失败: ${data.error}`);
                if (errorDiv) {
                    errorDiv.textContent = data.error || '登录失败，请重试';
                    errorDiv.style.display = 'block';
                } else {
                    alert(data.error || '登录失败，请重试');
                }
            }
        } catch (err) {
            this.log(`连接错误: ${err.message}`);
            console.error('Login error:', err);
            if (errorDiv) {
                errorDiv.textContent = '连接错误，请检查网络后重试';
                errorDiv.style.display = 'block';
            } else {
                alert('连接错误，请检查网络后重试');
            }
        } finally {
            // 恢复按钮状态
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.textContent = '进入聊天';
                this.log('登录按钮已恢复');
            }
        }
    }
    
    async handleRegister() {
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;
        const errorDiv = document.getElementById('auth-error');
        
        if (!username) {
            errorDiv.textContent = '用户名不能为空';
            return;
        }
        
        if (password !== passwordConfirm) {
            errorDiv.textContent = '两次密码输入不一致';
            return;
        }
        
        try {
            const response = await fetch('/api/auth/register-full', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, tenantId: this.tenantId })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.login(username, data.token, data.isAdmin || false);
                localStorage.setItem('chat_user', JSON.stringify({
                    userId: data.userId,
                    username: data.username,
                    token: data.token,
                    isRegistered: true,
                    isAdmin: data.isAdmin || false
                }));
            } else {
                errorDiv.textContent = data.error;
            }
        } catch (err) {
            errorDiv.textContent = '连接错误，请重试。';
        }
    }
    
    login(username, token, isAdmin = false) {
        this.log(`登录方法被调用 - 用户名: ${username}, isAdmin: ${isAdmin}`);
        this.currentUser = { username, token, isAdmin };
        
        this.socket = io({
            auth: { token, tenantId: this.tenantId }
        });
        
        this.setupSocketListeners();
        
        document.getElementById('auth-screen').classList.remove('active');
        document.getElementById('chat-screen').classList.add('active');
        document.getElementById('current-username').textContent = username;
        
        this.log(`页面切换完成，当前用户: ${username}, 是否管理员: ${isAdmin}`);
        
        // 如果不是管理员，自动连接管理员
        if (!isAdmin) {
            this.log('检测到普通用户，开始自动连接管理员...');
            this.autoConnectToAdmin();
        } else {
            this.log('检测到管理员账号，跳过自动连接');
        }
        this.loadConversations();
    }
    
    setupSocketListeners() {
        this.socket.on('receive_message', (data) => {
            // 播放新消息提示音
            if (typeof notificationSound !== 'undefined') {
                notificationSound.init();
                notificationSound.playNewMessage();
            }

            if (this.currentChat === data.from) {
                this.displayMessage(data, 'received');
                this.markMessageAsRead(data.id);
            } else {
        // 自动连接管理员
        this.autoConnectToAdmin();
                this.loadConversations();
            }
        });
        
        this.socket.on('message_sent', (data) => {
            console.log('Message sent:', data);
        });
        
        this.socket.on('history_result', (data) => {
            this.displayChatHistory(data.messages);
        });
        
        this.socket.on('translation_result', (data) => {
            this.showTranslationPreview(data.translated);
        });
        
        this.socket.on('incoming_call', (data) => {
            this.handleIncomingCall(data);
        });
        
        this.socket.on('call_answered', (data) => {
            this.handleCallAnswered(data);
        });
        
        this.socket.on('ice_candidate', (data) => {
            this.handleIceCandidate(data);
        });
        
        this.socket.on('call_ended', (data) => {
            this.handleCallEnded();
        });
    }
    
    logout() {
        localStorage.removeItem('chat_user');
        if (this.socket) {
            this.socket.disconnect();
        }
        location.reload();
    }
    
    async handleSearch(query) {
        if (!query || query.length < 2) {
            document.getElementById('search-results').innerHTML = '';
            return;
        }
        
        try {
            const response = await fetch(`/api/user/search?q=${encodeURIComponent(query)}&tenantId=${this.tenantId}`);
            const data = await response.json();
            
            const resultsDiv = document.getElementById('search-results');
            resultsDiv.innerHTML = data.users.map(user => `
                <div class="search-result-item" onclick="app.startChat('${user._id}', '${user.username}')">
                    ${user.username}
                </div>
            `).join('');
        } catch (err) {
            console.error('Search error:', err);
        }
    }
    
    startChat(userId, username) {
        this.log(`开始与 ${username} (ID: ${userId}) 聊天`);
        this.currentChat = userId;
        document.getElementById('chat-with-username').textContent = username;
        document.getElementById('no-chat-selected').classList.add('hidden');
        document.getElementById('chat-container').classList.remove('hidden');
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('search-user-input').value = '';
        
        this.loadChatHistory(userId);
        this.loadConversations();
    }
    
    async loadConversations() {
        try {
            const userId = this.currentUser?.userId;
            if (!userId) {
                console.error('User ID is undefined, cannot load conversations');
                return;
            }
            
            const response = await fetch(`/api/user/conversations?userId=${userId}&tenantId=${this.tenantId}`);
            const data = await response.json();
            
            const listDiv = document.getElementById('conversations-list');
            listDiv.innerHTML = data.conversations.map(conv => `
                <div class="conversation-item ${conv.userId === this.currentChat ? 'active' : ''}" 
                     onclick="app.startChat('${conv.userId}', '${conv.username}')">
                    <div class="conversation-username">${conv.username}</div>
                    <div class="conversation-last-message">${conv.lastMessage || '暂无消息'}</div>
                    ${conv.unreadCount > 0 ? `<div class="unread-badge">${conv.unreadCount}</div>` : ''}
                </div>
            `).join('');
        } catch (err) {
            console.error('Load conversations error:', err);
        }
    }
    
    loadChatHistory(userId) {
        this.socket.emit('get_history', { withUser: userId, limit: 50 });
    }
    
    displayChatHistory(messages) {
        const container = document.getElementById('messages-container');
        container.innerHTML = '';
        
        messages.forEach(msg => {
            const type = msg.from === this.currentUser.userId ? 'sent' : 'received';
            this.displayMessage(msg, type, false);
        });
        
        this.scrollToBottom();
    }
    
    sendMessage() {
        const input = document.getElementById('message-input');
        const content = input.value.trim();
        
        if (!content || !this.currentChat) return;
        
        const messageData = {
            to: this.currentChat,
            content: content,
            originalLang: 'auto',
            translatedLang: 'en'
        };
        
        this.socket.emit('send_message', messageData);
        
        this.displayMessage({
            content: content,
            timestamp: new Date()
        }, 'sent');
        
        input.value = '';
        this.scrollToBottom();
    }
    
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file || !this.currentChat) return;
        
        // 检查文件大小（10MB）
        if (file.size > 10 * 1024 * 1024) {
            alert('文件大小不能超过10MB');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            // 显示上传中状态
            const uploadBtn = document.getElementById('upload-file-btn');
            const originalText = uploadBtn.textContent;
            uploadBtn.textContent = '⏳';
            
            const response = await fetch('/api/upload/file', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // 发送文件消息
                const messageContent = `[文件] ${result.fileName}\n${result.fileUrl}`;
                
                this.socket.emit('send_message', {
                    to: this.currentChat,
                    content: messageContent,
                    isFile: true,
                    fileUrl: result.fileUrl,
                    fileName: result.fileName,
                    fileType: result.fileType
                });
                
                // 显示文件消息
                this.displayFileMessage(result, 'sent');
                
                // 播放成功提示音
                if (typeof notificationSound !== 'undefined') {
                    notificationSound.playSystemSound('success');
                }
            } else {
                throw new Error(result.error || '上传失败');
            }
            
            // 重置按钮
            uploadBtn.textContent = originalText;
            event.target.value = ''; // 清空文件输入
            
        } catch (error) {
            console.error('File upload error:', error);
            alert('文件上传失败: ' + error.message);
            
            // 重置按钮
            const uploadBtn = document.getElementById('upload-file-btn');
            uploadBtn.textContent = '📎';
        }
    }
    
    displayFileMessage(fileData, type) {
        const container = document.getElementById('messages-container');
        const time = new Date().toLocaleTimeString();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} file-message`;
        
        const isImage = fileData.fileType && fileData.fileType.startsWith('image/');
        const isVideo = fileData.fileType && fileData.fileType.startsWith('video/');
        const isAudio = fileData.fileType && fileData.fileType.startsWith('audio/');
        
        if (isImage) {
            messageDiv.innerHTML = `
                <div class="file-content">
                    <img src="${fileData.fileUrl}" alt="${fileData.fileName}" style="max-width: 200px; max-height: 200px; border-radius: 8px; cursor: pointer;" />
                    <div class="file-name">${fileData.fileName}</div>
                </div>
                <div class="message-time">${time}</div>
            `;
        } else if (isVideo) {
            messageDiv.innerHTML = `
                <div class="file-content">
                    <video src="${fileData.fileUrl}" controls preload="metadata" style="max-width: 100%; max-height: 300px; border-radius: 8px;"></video>
                    <div class="file-name">${fileData.fileName}</div>
                </div>
                <div class="message-time">${time}</div>
            `;
        } else if (isAudio) {
            messageDiv.innerHTML = `
                <div class="file-content">
                    <audio src="${fileData.fileUrl}" controls preload="metadata" style="width: 100%; max-width: 300px;"></audio>
                    <div class="file-name">${fileData.fileName}</div>
                </div>
                <div class="message-time">${time}</div>
            `;
        } else {
            // PDF, Excel, Word 等文档
            const fileIcon = this.getFileIcon(fileData.fileName);
            messageDiv.innerHTML = `
                <div class="file-content">
                    <div class="file-icon">${fileIcon}</div>
                    <div class="file-info">
                        <div class="file-name">${fileData.fileName}</div>
                        <a href="${fileData.fileUrl}" target="_blank" download="${fileData.fileName}">📥 下载文件</a>
                    </div>
                </div>
                <div class="message-time">${time}</div>
            `;
        }
        
        container.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    getFileIcon(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        const icons = {
            'pdf': '📕',
            'doc': '📘',
            'docx': '📘',
            'xls': '📗',
            'xlsx': '📗',
            'ppt': '📙',
            'pptx': '📙',
            'txt': '📄',
            'csv': '📊',
            'zip': '📦',
            'rar': '📦'
        };
        return icons[ext] || '📄';
    }
    
    displayMessage(msg, type, scroll = true) {
        const container = document.getElementById('messages-container');
        const time = new Date(msg.timestamp).toLocaleTimeString();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-bubble">${this.escapeHtml(msg.content)}</div>
            <div class="message-time">${time}</div>
        `;
        
        container.appendChild(messageDiv);
        
        // 如果是收到的消息且当前正在聊天，标记为已读
        if (type === 'received' && msg.id && this.currentChat) {
            setTimeout(() => {
                this.socket.emit('mark_as_read', { messageId: msg.id });
            }, 100);
        }
        
        if (scroll) {
            this.scrollToBottom();
        }
    }
    
    handleMessageRead(data) {
        // 更新 UI 显示已读状态
        const messageElement = document.querySelector(`[data-message-id="${data.messageId}"]`);
        if (messageElement) {
            const timeElement = messageElement.querySelector('.message-time');
            if (timeElement) {
                timeElement.textContent += ' ✓✓';
            }
        }
    }
    
    showMessageContextMenu(event, messageId) {
        // 移除现有的菜单
        const existingMenu = document.getElementById('message-context-menu');
        if (existingMenu) existingMenu.remove();
        
        // 创建上下文菜单
        const menu = document.createElement('div');
        menu.id = 'message-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: \${event.clientX}px;
            top: \${event.clientY}px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 8px 0;
            z-index: 10000;
            min-width: 120px;
        `;
        
        const deleteItem = document.createElement('div');
        deleteItem.textContent = '撤回消息';
        deleteItem.style.cssText = `
            padding: 10px 15px;
            cursor: pointer;
            color: #e53e3e;
            font-size: 14px;
        `;
        deleteItem.addEventListener('mouseenter', () => {
            deleteItem.style.background = '#f5f5f5';
        });
        deleteItem.addEventListener('mouseleave', () => {
            deleteItem.style.background = 'transparent';
        });
        deleteItem.addEventListener('click', () => {
            this.deleteMessage(messageId);
            menu.remove();
        });
        
        menu.appendChild(deleteItem);
        document.body.appendChild(menu);
        
        // 点击其他地方关闭菜单
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 100);
    }
    
    async deleteMessage(messageId) {
        try {
            this.socket.emit('delete_message', { messageId });
            
            // 立即更新 UI
            const messageElement = document.querySelector(`[data-message-id="\${messageId}"]`);
            if (messageElement) {
                messageElement.innerHTML = `
                    <div style="color: #999; font-style: italic;">此消息已撤回</div>
                    <div class="message-time"></div>
                `;
            }
        } catch (error) {
            console.error('Delete message error:', error);
            alert('撤回失败');
        }
    }
    
    handleMessageDeleted(data) {
        const messageElement = document.querySelector(`[data-message-id="\${data.messageId}"]`);
        if (messageElement) {
            messageElement.innerHTML = `
                <div style="color: #999; font-style: italic;">此消息已撤回</div>
                <div class="message-time"></div>
            `;
        }
    }
    
    scrollToBottom() {
        const container = document.getElementById('messages-container');
        container.scrollTop = container.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    toggleTranslation() {
        this.translationEnabled = !this.translationEnabled;
        const btn = document.getElementById('translate-toggle-btn');
        btn.style.background = this.translationEnabled ? '#667eea' : '';
        btn.style.color = this.translationEnabled ? 'white' : '';
    }
    
    showTranslationPreview(translatedText) {
        const preview = document.getElementById('translation-preview');
        preview.textContent = `翻译预览: ${translatedText}`;
        preview.classList.remove('hidden');
        
        setTimeout(() => {
            preview.classList.add('hidden');
        }, 5000);
    }
    
    async startVoiceRecording() {
        try {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'zh-CN';
            recognition.interimResults = false;
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('message-input').value = transcript;
            };
            
            recognition.start();
        } catch (err) {
            alert('当前浏览器不支持语音识别');
        }
    }
    
    async startVideoCall() {
        if (!this.currentChat) return;
        
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            document.getElementById('local-video').srcObject = this.localStream;
            document.getElementById('video-call-modal').classList.remove('hidden');
            
            this.peerConnection = new RTCPeerConnection(this.rtcConfig);
            
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            
            this.peerConnection.ontrack = (event) => {
                document.getElementById('remote-video').srcObject = event.streams[0];
            };
            
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    this.socket.emit('ice_candidate', {
                        to: this.currentChat,
                        candidate: event.candidate
                    });
                }
            };
            
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            
            this.socket.emit('video_call', {
                to: this.currentChat,
                signal: offer
            });
        } catch (err) {
            console.error('Video call error:', err);
            alert('无法启动视频通话');
        }
    }
    
    async handleIncomingCall(data) {
        const accept = confirm(`来自 ${data.fromUsername} 的视频通话，是否接听？`);
        
        if (accept) {
            try {
                this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                document.getElementById('local-video').srcObject = this.localStream;
                document.getElementById('video-call-modal').classList.remove('hidden');
                
                this.peerConnection = new RTCPeerConnection(this.rtcConfig);
                
                this.localStream.getTracks().forEach(track => {
                    this.peerConnection.addTrack(track, this.localStream);
                });
                
                this.peerConnection.ontrack = (event) => {
                    document.getElementById('remote-video').srcObject = event.streams[0];
                };
                
                this.peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        this.socket.emit('ice_candidate', {
                            to: data.from,
                            candidate: event.candidate
                        });
                    }
                };
                
                await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
                const answer = await this.peerConnection.createAnswer();
                await this.peerConnection.setLocalDescription(answer);
                
                this.socket.emit('answer_call', {
                    to: data.from,
                    signal: answer
                });
            } catch (err) {
                console.error('Answer call error:', err);
            }
        }
    }
    
    async handleCallAnswered(data) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
    }
    
    async handleIceCandidate(data) {
        if (this.peerConnection) {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    }
    
    endVideoCall() {
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        
        if (this.currentChat) {
            this.socket.emit('end_call', { to: this.currentChat });
        }
        
        document.getElementById('video-call-modal').classList.add('hidden');
        document.getElementById('local-video').srcObject = null;
        document.getElementById('remote-video').srcObject = null;
    }
    
    handleCallEnded() {
        this.endVideoCall();
    }
    
    openSocialLinksModal() {
        document.getElementById('social-links-modal').classList.remove('hidden');
    }
    
    openRemarkModal() {
        if (!this.currentChat) {
            alert('请先选择一个用户');
            return;
        }
        document.getElementById('remark-modal').classList.remove('hidden');
    }
    
    async saveSocialLinks() {
        const socialLinks = {
            tiktok: document.getElementById('tiktok-input').value,
            wechat: document.getElementById('wechat-input').value,
            lark: document.getElementById('lark-input').value,
            facebook: document.getElementById('facebook-input').value,
            whatsapp: document.getElementById('whatsapp-input').value,
            telegram: document.getElementById('telegram-input').value
        };
        
        try {
            const response = await fetch(`/api/user/${this.currentUser.userId}/social-links`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ socialLinks })
            });
            
            if (response.ok) {
                alert('社交账号已保存！');
                this.closeAllModals();
            }
        } catch (err) {
            console.error('Save social links error:', err);
        }
    }
    
    openSuggestionsModal() {
        document.getElementById('suggestions-modal').classList.remove('hidden');
        this.loadSuggestions();
    }
    
    async loadSuggestions() {
        try {
            const response = await fetch('/api/suggestions');
            const data = await response.json();
            
            const listDiv = document.getElementById('suggestions-list');
            listDiv.innerHTML = data.suggestions.map(sugg => `
                <div class="suggestion-item">
                    <h4>${sugg.username}</h4>
                    <p>${sugg.content}</p>
                    <div class="suggestion-votes">票数: ${sugg.votes}</div>
                </div>
            `).join('');
        } catch (err) {
            console.error('Load suggestions error:', err);
        }
    }
    
    async submitSuggestion() {
        const content = document.getElementById('suggestion-input').value.trim();
        
        if (!content || content.length < 10) {
            alert('建议内容至少需要 10 个字符');
            return;
        }
        
        try {
            const response = await fetch('/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.currentUser.userId,
                    username: this.currentUser.username,
                    content
                })
            });
            
            if (response.ok) {
                document.getElementById('suggestion-input').value = '';
                this.loadSuggestions();
            }
        } catch (err) {
            console.error('Submit suggestion error:', err);
        }
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    }
    
    markMessageAsRead(messageId) {
        console.log('Message marked as read:', messageId);
    }
    
    async saveRemark() {
        if (!this.currentChat) return;
        
        const remark = document.getElementById('remark-input').value.trim();
        
        if (!remark) {
            alert('备注不能为空');
            return;
        }
        
        try {
            const response = await fetch('/api/user/remark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.currentUser.userId,
                    targetUserId: this.currentChat,
                    remark
                })
            });
            
            if (response.ok) {
                alert('备注已保存！');
                document.getElementById('remark-input').value = '';
                this.closeAllModals();
            }
        } catch (err) {
            console.error('Save remark error:', err);
            alert('保存备注失败');
        }
    }

    // 麦克风录音功能
    setupVoiceRecording() {
        const voiceBtn = document.getElementById('voice-record-btn');
        if (!voiceBtn) return;
        
        let mediaRecorder = null;
        let audioChunks = [];
        let isRecording = false;
        let audioStream = null;
        
        // 开始录音函数
        const startRecording = async () => {
            if (isRecording) return;
            
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioStream = stream;
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };
                
                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    
                    // 上传音频文件
                    const formData = new FormData();
                    formData.append('file', audioBlob, 'voice-message.webm');
                    
                    try {
                        const response = await fetch('/api/upload/file', {
                            method: 'POST',
                            body: formData
                        });
                        
                        const result = await response.json();
                        
                        if (result.success && this.currentChat) {
                            // 发送音频消息
                            this.socket.emit('send_message', {
                                to: this.currentChat,
                                content: result.fileUrl,
                                isAudio: true,
                                fileUrl: result.fileUrl,
                                fileName: '语音消息',
                                fileType: 'audio/webm'
                            });
                            
                            // 显示音频消息
                            this.displayAudioMessage(result, 'sent');
                        }
                    } catch (err) {
                        console.error('Voice upload error:', err);
                        alert('语音上传失败');
                    }
                    
                    // 停止所有音频轨道
                    if (audioStream) {
                        audioStream.getTracks().forEach(track => track.stop());
                        audioStream = null;
                    }
                };
                
                mediaRecorder.start();
                isRecording = true;
                voiceBtn.classList.add('recording');
                voiceBtn.style.background = '#ef4444';
                voiceBtn.style.transform = 'scale(1.1)';
            } catch (err) {
                console.error('Microphone error:', err);
                alert('无法访问麦克风: ' + err.message);
            }
        };
        
        // 停止录音函数
        const stopRecording = () => {
            if (!isRecording || !mediaRecorder) return;
            
            mediaRecorder.stop();
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceBtn.style.background = '';
            voiceBtn.style.transform = '';
        };
        
        // PC端鼠标事件
        voiceBtn.addEventListener('mousedown', startRecording);
        voiceBtn.addEventListener('mouseup', stopRecording);
        voiceBtn.addEventListener('mouseleave', stopRecording);
        
        // 移动端触摸事件（修复）
        voiceBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            startRecording();
        }, { passive: false });
        
        voiceBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            stopRecording();
        }, { passive: false });
        
        voiceBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            stopRecording();
        }, { passive: false });
    }
    
    displayAudioMessage(fileData, type) {
        const container = document.getElementById('messages-container');
        const time = new Date().toLocaleTimeString();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} audio-message`;
        
        messageDiv.innerHTML = `
            <div class="file-content">
                <audio controls src="${fileData.fileUrl}" style="max-width: 250px;"></audio>
                <div class="file-name">语音消息</div>
            </div>
            <div class="message-time">${time}</div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }
    
    // 剪贴板粘贴支持（截图上传）
    setupClipboardPaste() {
        document.addEventListener('paste', async (event) => {
            const items = event.clipboardData?.items;
            if (!items) return;
            
            // 查找图片数据
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    event.preventDefault();
                    
                    const blob = items[i].getAsFile();
                    if (!blob) continue;
                    
                    // 显示上传提示
                    this.showNotification('正在上传截图...');
                    
                    try {
                        // 上传截图
                        const formData = new FormData();
                        formData.append('file', blob, 'screenshot.png');
                        
                        const response = await fetch('/api/upload/file', {
                            method: 'POST',
                            body: formData
                        });
                        
                        const result = await response.json();
                        
                        if (result.success && this.currentChat) {
                            // 发送图片消息
                            this.socket.emit('send_message', {
                                to: this.currentChat,
                                content: result.fileUrl,
                                isImage: true,
                                fileUrl: result.fileUrl,
                                fileName: result.fileName || '截图',
                                fileType: result.fileType
                            });
                            
                            // 显示图片消息
                            this.displayFileMessage(result, 'sent');
                            this.showNotification('截图上传成功');
                        }
                    } catch (err) {
                        console.error('Screenshot upload error:', err);
                        this.showNotification('截图上传失败: ' + err.message);
                    }
                    
                    break;
                }
            }
        });
    }
    
    // 显示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 100000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    
    async autoConnectToAdmin() {
        this.log('autoConnectToAdmin 方法被调用');
        try {
            // 获取管理员账号
            this.log(`请求管理员信息: /api/auth/admin?tenantId=${this.tenantId}`);
            const response = await fetch(`/api/auth/admin?tenantId=${this.tenantId}`);
            this.log(`管理员 API 响应状态: ${response.status}`);
            const data = await response.json();
            this.log(`管理员数据:`, data);
            
            if (data.userId) {
                this.log(`找到管理员: ${data.username} (ID: ${data.userId})`);
                // 自动打开与管理员的聊天
                setTimeout(() => {
                    this.log(`开始连接到管理员聊天...`);
                    this.startChat(data.userId, data.username);
                    this.log(`已启动与管理员的聊天`);
                }, 500); // 延迟500ms确保DOM完全加载
            } else {
                this.log('错误: 未找到管理员用户');
            }
        } catch (err) {
            this.log(`连接管理员失败: ${err.message}`);
            console.error('Failed to connect to admin:', err);
        }
    }
}

const app = new ChatApp();
