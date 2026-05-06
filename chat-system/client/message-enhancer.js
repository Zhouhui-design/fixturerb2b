/**
 * 消息增强功能模块
 * 包括：图片查看器、视频播放器、文件预览、语音转文字、文字转语音、消息菜单
 */

class MessageEnhancer {
    constructor(chatApp) {
        this.chatApp = chatApp;
        this.currentImageZoom = 1;
        this.init();
    }
    
    init() {
        this.setupMessageObserver();
        this.bindGlobalEvents();
    }
    
    // 监听新消息，自动添加增强功能
    setupMessageObserver() {
        const container = document.getElementById('messages-container');
        if (!container) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('message')) {
                        this.enhanceMessage(node);
                    }
                });
            });
        });
        
        observer.observe(container, { childList: true, subtree: true });
    }
    
    // 增强单条消息
    enhanceMessage(messageElement) {
        // 添加消息菜单按钮
        this.addMessageMenu(messageElement);
        
        // 增强图片
        this.enhanceImages(messageElement);
        
        // 增强视频
        this.enhanceVideos(messageElement);
        
        // 增强文件（PDF/Excel等）
        this.enhanceFiles(messageElement);
        
        // 增强音频（添加转文字按钮）
        this.enhanceAudio(messageElement);
        
        // 增强文字（添加转语音按钮）
        this.enhanceText(messageElement);
    }
    
    // 添加消息菜单（三个点）
    addMessageMenu(messageElement) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'message-menu-btn';
        menuBtn.innerHTML = '⋯';
        menuBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0,0,0,0.1);
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10;
        `;
        
        messageElement.style.position = 'relative';
        messageElement.appendChild(menuBtn);
        
        // 鼠标悬停显示菜单按钮
        messageElement.addEventListener('mouseenter', () => {
            menuBtn.style.display = 'flex';
        });
        
        messageElement.addEventListener('mouseleave', () => {
            menuBtn.style.display = 'none';
        });
        
        // 点击显示菜单
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showMessageMenu(e, messageElement);
        });
    }
    
    // 显示消息菜单
    showMessageMenu(event, messageElement) {
        // 移除现有菜单
        const existingMenu = document.querySelector('.message-context-menu');
        if (existingMenu) existingMenu.remove();
        
        const isSent = messageElement.classList.contains('sent');
        const messageBubble = messageElement.querySelector('.message-bubble');
        const messageContent = messageBubble ? messageBubble.textContent : '';
        const hasImage = messageElement.querySelector('img');
        const hasVideo = messageElement.querySelector('video');
        const hasAudio = messageElement.querySelector('audio');
        const hasFile = messageElement.querySelector('.file-content');
        
        const menu = document.createElement('div');
        menu.className = 'message-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${event.clientX}px;
            top: ${event.clientY}px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 8px 0;
            z-index: 10000;
            min-width: 150px;
        `;
        
        // 菜单项配置
        const menuItems = [];
        
        // 引用
        menuItems.push({
            icon: '↩️',
            text: '引用',
            action: () => this.quoteMessage(messageContent)
        });
        
        // 复制
        menuItems.push({
            icon: '📋',
            text: '复制',
            action: () => this.copyMessage(messageContent)
        });
        
        // 下载（如果有文件）
        if (hasImage || hasVideo || hasAudio || hasFile) {
            menuItems.push({
                icon: '⬇️',
                text: '下载',
                action: () => this.downloadMedia(messageElement)
            });
        }
        
        // 语音转文字（如果是音频）
        if (hasAudio) {
            menuItems.push({
                icon: '🔤',
                text: '语音转文字',
                action: () => this.speechToText(messageElement)
            });
        }
        
        // 文字转语音（如果是文字）
        if (messageContent && !hasImage && !hasVideo && !hasAudio) {
            menuItems.push({
                icon: '🔊',
                text: '文字转语音',
                action: () => this.textToSpeech(messageContent)
            });
        }
        
        // 翻译
        if (messageContent) {
            menuItems.push({
                icon: '🌐',
                text: '翻译',
                action: () => this.translateMessage(messageContent)
            });
        }
        
        // 创建菜单项
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.style.cssText = `
                padding: 10px 15px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            menuItem.innerHTML = `<span>${item.icon}</span><span>${item.text}</span>`;
            
            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.background = '#f5f5f5';
            });
            
            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.background = 'transparent';
            });
            
            menuItem.addEventListener('click', () => {
                item.action();
                menu.remove();
            });
            
            menu.appendChild(menuItem);
        });
        
        document.body.appendChild(menu);
        
        // 点击其他地方关闭菜单
        setTimeout(() => {
            const closeMenu = () => {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            };
            document.addEventListener('click', closeMenu);
        }, 100);
    }
    
    // ==================== 图片增强 ====================
    
    enhanceImages(messageElement) {
        const images = messageElement.querySelectorAll('img');
        images.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                this.openImageViewer(img.src);
            });
        });
    }
    
    // 打开图片查看器
    openImageViewer(imageSrc) {
        this.currentImageZoom = 1;
        
        const overlay = document.createElement('div');
        overlay.className = 'image-viewer-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: zoom-out;
        `;
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.cssText = `
            max-width: 90vw;
            max-height: 90vh;
            transition: transform 0.2s ease;
            transform: scale(${this.currentImageZoom});
        `;
        
        // 滚轮缩放
        overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.currentImageZoom = Math.min(this.currentImageZoom + 0.1, 5);
            } else {
                this.currentImageZoom = Math.max(this.currentImageZoom - 0.1, 0.5);
            }
            img.style.transform = `scale(${this.currentImageZoom})`;
        });
        
        // 双击重置
        overlay.addEventListener('dblclick', () => {
            this.currentImageZoom = 1;
            img.style.transform = `scale(1)`;
        });
        
        // 移动端双指缩放
        let initialDistance = 0;
        overlay.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
            }
        });
        
        overlay.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                
                const scale = currentDistance / initialDistance;
                this.currentImageZoom = Math.max(0.5, Math.min(5, scale));
                img.style.transform = `scale(${this.currentImageZoom})`;
            }
        });
        
        // 点击关闭
        overlay.addEventListener('click', () => {
            overlay.remove();
        });
        
        overlay.appendChild(img);
        document.body.appendChild(overlay);
    }
    
    // ==================== 视频增强 ====================
    
    enhanceVideos(messageElement) {
        const videos = messageElement.querySelectorAll('video');
        videos.forEach(video => {
            video.controls = true;
            video.style.maxWidth = '100%';
            video.style.borderRadius = '8px';
        });
    }
    
    // ==================== 文件增强 ====================
    
    enhanceFiles(messageElement) {
        const fileLinks = messageElement.querySelectorAll('.file-content a');
        fileLinks.forEach(link => {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            // 添加下载属性
            if (!link.hasAttribute('download')) {
                link.setAttribute('download', '');
            }
        });
    }
    
    // ==================== 音频增强 ====================
    
    enhanceAudio(messageElement) {
        const audioElements = messageElement.querySelectorAll('audio');
        audioElements.forEach(audio => {
            audio.controls = true;
            audio.style.width = '100%';
            audio.style.maxWidth = '300px';
        });
    }
    
    // ==================== 文字增强 ====================
    
    enhanceText(messageElement) {
        // 文字消息已经在消息气泡中，不需要特殊处理
    }
    
    // ==================== 菜单功能实现 ====================
    
    // 引用消息
    quoteMessage(content) {
        const input = document.getElementById('message-input');
        if (input) {
            input.value = `> ${content}\n\n` + input.value;
            input.focus();
        }
    }
    
    // 复制消息
    copyMessage(content) {
        navigator.clipboard.writeText(content).then(() => {
            this.showNotification('已复制到剪贴板');
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('复制失败');
        });
    }
    
    // 下载媒体文件
    downloadMedia(messageElement) {
        const img = messageElement.querySelector('img');
        const video = messageElement.querySelector('video');
        const audio = messageElement.querySelector('audio');
        const link = messageElement.querySelector('.file-content a');
        
        let url = '';
        let filename = 'download';
        
        if (img) {
            url = img.src;
            filename = 'image.png';
        } else if (video) {
            url = video.src;
            filename = 'video.mp4';
        } else if (audio) {
            url = audio.src;
            filename = 'audio.webm';
        } else if (link) {
            url = link.href;
            filename = link.textContent || 'file';
        }
        
        if (url) {
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
    
    // 语音转文字（使用 Web Speech API）
    async speechToText(messageElement) {
        const audio = messageElement.querySelector('audio');
        if (!audio) {
            alert('未找到音频');
            return;
        }
        
        // 提示用户：目前浏览器不支持直接音频转文字
        // 需要后端支持或使用第三方 API
        this.showNotification('语音转文字功能需要后端支持，正在开发中...');
        
        // TODO: 实现真正的语音转文字
        // 方案1: 上传音频到后端，使用 Whisper API 或其他 STT 服务
        // 方案2: 使用浏览器的 SpeechRecognition API（但需要实时录音，不能处理已有音频）
    }
    
    // 文字转语音
    textToSpeech(text) {
        if ('speechSynthesis' in window) {
            // 取消之前的播放
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 1;
            utterance.pitch = 1;
            
            utterance.onstart = () => {
                this.showNotification('正在播放语音...');
            };
            
            utterance.onend = () => {
                this.showNotification('播放完成');
            };
            
            speechSynthesis.speak(utterance);
        } else {
            alert('您的浏览器不支持文字转语音功能');
        }
    }
    
    // 翻译消息
    async translateMessage(text) {
        if (!window.enhancedFeatures || !window.enhancedFeatures.translationManager) {
            alert('翻译功能未初始化');
            return;
        }
        
        try {
            this.showNotification('正在翻译...');
            
            const translated = await window.enhancedFeatures.translationManager.translateText(
                text, 'auto', 'zh'
            );
            
            // 显示翻译结果
            this.showTranslationResult(text, translated);
        } catch (err) {
            console.error('Translation error:', err);
            alert('翻译失败: ' + err.message);
        }
    }
    
    // 显示翻译结果
    showTranslationResult(original, translated) {
        const modal = document.createElement('div');
        modal.className = 'translation-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 100001;
            max-width: 500px;
            width: 90%;
        `;
        
        modal.innerHTML = `
            <h3 style="margin-bottom: 20px; color: #333;">翻译结果</h3>
            <div style="margin-bottom: 15px;">
                <div style="font-size: 12px; color: #999; margin-bottom: 5px;">原文：</div>
                <div style="padding: 10px; background: #f5f5f5; border-radius: 8px; word-wrap: break-word;">${original}</div>
            </div>
            <div style="margin-bottom: 20px;">
                <div style="font-size: 12px; color: #999; margin-bottom: 5px;">译文：</div>
                <div style="padding: 10px; background: #e3f2fd; border-radius: 8px; word-wrap: break-word; color: #1976d2;">${translated}</div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button class="copy-translation-btn" style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 6px; cursor: pointer;">复制译文</button>
                <button class="close-translation-btn" style="padding: 8px 16px; border: none; background: #2196f3; color: white; border-radius: 6px; cursor: pointer;">关闭</button>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 100000;
        `;
        
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        modal.querySelector('.close-translation-btn').addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        modal.querySelector('.copy-translation-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(translated).then(() => {
                this.showNotification('已复制译文');
            });
        });
        
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }
    
    // 显示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 100002;
            font-size: 14px;
            animation: fadeInOut 2s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
    
    // 绑定全局事件
    bindGlobalEvents() {
        // ESC 键关闭图片查看器
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const overlay = document.querySelector('.image-viewer-overlay');
                if (overlay) {
                    overlay.remove();
                }
                
                const modal = document.querySelector('.translation-modal');
                if (modal) {
                    modal.remove();
                    modal.previousElementSibling?.remove(); // 移除 overlay
                }
            }
        });
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessageEnhancer;
}
