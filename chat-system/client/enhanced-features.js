/**
 * 增强功能模块 - 通话和翻译
 * 包括：WebRTC 语音/视频通话、文字翻译、语音翻译
 */

class EnhancedFeatures {
    constructor(chatApp) {
        this.chatApp = chatApp;
        this.socket = chatApp.socket;
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.currentCall = null;
        this.isCallActive = false;
        
        // 翻译相关
        this.translationManager = new TranslationManager();
        this.voiceTranslationManager = new VoiceTranslationManager();
        
        // WebRTC ICE 服务器配置
        this.iceServers = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
                // TODO: 添加 TURN 服务器
            ]
        };
        
        this.init();
    }
    
    init() {
        this.bindCallButtons();
        this.bindTranslationButtons();
        this.setupSocketListeners();
    }
    
    // ==================== 通话功能 ====================
    
    bindCallButtons() {
        // 语音通话按钮
        const voiceCallBtn = document.getElementById('voice-call-btn');
        if (voiceCallBtn) {
            voiceCallBtn.addEventListener('click', () => this.startVoiceCall());
        }
        
        // 视频通话按钮
        const videoCallBtn = document.getElementById('video-call-btn');
        if (videoCallBtn) {
            videoCallBtn.addEventListener('click', () => this.startVideoCall());
        }
        
        // 接听按钮
        const answerCallBtn = document.getElementById('answer-call-btn');
        if (answerCallBtn) {
            answerCallBtn.addEventListener('click', () => this.answerCall());
        }
        
        // 拒接按钮
        const rejectCallBtn = document.getElementById('reject-call-btn');
        if (rejectCallBtn) {
            rejectCallBtn.addEventListener('click', () => this.rejectCall());
        }
        
        // 挂断按钮
        const endCallBtn = document.getElementById('end-call-btn');
        if (endCallBtn) {
            endCallBtn.addEventListener('click', () => this.endCall());
        }
    }
    
    async startVoiceCall() {
        if (!this.chatApp.currentChat) {
            alert('请先选择一个聊天对象');
            return;
        }
        
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ 
                audio: true, 
                video: false 
            });
            
            this.createPeerConnection();
            
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            
            this.socket.emit('video_call', {
                to: this.chatApp.currentChat,
                signal: offer,
                callType: 'voice'
            });
            
            this.showCallUI('voice', 'outgoing');
            this.isCallActive = true;
            
        } catch (err) {
            console.error('Voice call error:', err);
            alert('无法启动语音通话: ' + err.message);
        }
    }
    
    async startVideoCall() {
        if (!this.chatApp.currentChat) {
            alert('请先选择一个聊天对象');
            return;
        }
        
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({ 
                audio: true, 
                video: true 
            });
            
            this.createPeerConnection();
            
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            
            // 显示本地视频
            const localVideo = document.getElementById('local-video');
            if (localVideo) {
                localVideo.srcObject = this.localStream;
            }
            
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            
            this.socket.emit('video_call', {
                to: this.chatApp.currentChat,
                signal: offer,
                callType: 'video'
            });
            
            this.showCallUI('video', 'outgoing');
            this.isCallActive = true;
            
        } catch (err) {
            console.error('Video call error:', err);
            alert('无法启动视频通话: ' + err.message);
        }
    }
    
    createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(this.iceServers);
        
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate && this.chatApp.currentChat) {
                this.socket.emit('ice_candidate', {
                    to: this.chatApp.currentChat,
                    candidate: event.candidate
                });
            }
        };
        
        this.peerConnection.ontrack = (event) => {
            this.remoteStream = event.streams[0];
            const remoteVideo = document.getElementById('remote-video');
            if (remoteVideo) {
                remoteVideo.srcObject = this.remoteStream;
            }
        };
        
        this.peerConnection.onconnectionstatechange = () => {
            if (this.peerConnection.connectionState === 'disconnected' || 
                this.peerConnection.connectionState === 'failed') {
                this.endCall();
            }
        };
    }
    
    async answerCall(signal, fromUserId, callType) {
        try {
            const mediaConstraints = callType === 'video' 
                ? { audio: true, video: true } 
                : { audio: true, video: false };
            
            this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
            
            this.createPeerConnection();
            
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            
            if (callType === 'video') {
                const localVideo = document.getElementById('local-video');
                if (localVideo) {
                    localVideo.srcObject = this.localStream;
                }
            }
            
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
            
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            
            this.socket.emit('answer_call', {
                to: fromUserId,
                signal: answer
            });
            
            this.currentCall = fromUserId;
            this.showCallUI(callType, 'connected');
            this.isCallActive = true;
            
        } catch (err) {
            console.error('Answer call error:', err);
            alert('接听通话失败: ' + err.message);
        }
    }
    
    rejectCall() {
        if (this.currentCall) {
            this.socket.emit('end_call', { to: this.currentCall });
            this.hideCallUI();
            this.currentCall = null;
        }
    }
    
    endCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        
        if (this.currentCall) {
            this.socket.emit('end_call', { to: this.currentCall });
            this.currentCall = null;
        }
        
        this.isCallActive = false;
        this.hideCallUI();
    }
    
    showCallUI(type, status) {
        const modal = document.getElementById('video-call-modal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // 更新标题
            const title = modal.querySelector('h3');
            if (title) {
                const callTypeText = type === 'video' ? '视频通话' : '语音通话';
                const statusText = status === 'outgoing' ? ' - 呼叫中...' : 
                                  status === 'connected' ? ' - 通话中' : '';
                title.textContent = callTypeText + statusText;
            }
            
            // 显示/隐藏视频元素
            const localVideo = document.getElementById('local-video');
            if (localVideo) {
                localVideo.style.display = type === 'video' ? 'block' : 'none';
            }
        }
    }
    
    hideCallUI() {
        const modal = document.getElementById('video-call-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    // ==================== Socket 监听 ====================
    
    setupSocketListeners() {
        this.socket.on('incoming_call', (data) => {
            console.log('Incoming call:', data);
            this.showIncomingCallUI(data);
        });
        
        this.socket.on('call_answered', async (data) => {
            console.log('Call answered');
            if (this.peerConnection) {
                await this.peerConnection.setRemoteDescription(
                    new RTCSessionDescription(data.signal)
                );
            }
            this.showCallUI('video', 'connected');
        });
        
        this.socket.on('ice_candidate', async (data) => {
            if (this.peerConnection && data.candidate) {
                await this.peerConnection.addIceCandidate(
                    new RTCIceCandidate(data.candidate)
                );
            }
        });
        
        this.socket.on('call_ended', () => {
            console.log('Call ended by remote');
            this.endCall();
        });
    }
    
    showIncomingCallUI(data) {
        const { fromUsername, callType, signal } = data;
        
        // 显示来电通知
        const notification = document.createElement('div');
        notification.className = 'call-notification';
        notification.innerHTML = `
            <div class="call-notification-content">
                <h4>${fromUsername} 发起${callType === 'video' ? '视频' : '语音'}通话</h4>
                <div class="call-actions">
                    <button class="answer-btn" style="background: #10b981; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">接听</button>
                    <button class="reject-btn" style="background: #ef4444; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">拒接</button>
                </div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10000;
        `;
        
        document.body.appendChild(notification);
        
        // 播放铃声
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn8K1gGgU7k9r0unEiBSuB0PLa');
        audio.loop = true;
        audio.play().catch(() => {});
        
        // 接听按钮
        notification.querySelector('.answer-btn').addEventListener('click', () => {
            audio.pause();
            notification.remove();
            this.answerCall(signal, data.from, callType);
        });
        
        // 拒接按钮
        notification.querySelector('.reject-btn').addEventListener('click', () => {
            audio.pause();
            notification.remove();
            this.rejectCall();
        });
    }
    
    // ==================== 翻译功能 ====================
    
    bindTranslationButtons() {
        const translateBtn = document.getElementById('translate-toggle-btn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => this.showTranslationMenu());
        }
    }
    
    showTranslationMenu() {
        // 移除已存在的菜单
        const existing = document.getElementById('translation-menu');
        if (existing) existing.remove();
        
        const menu = document.createElement('div');
        menu.id = 'translation-menu';
        menu.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); position: absolute; bottom: 60px; right: 10px; z-index: 1000; min-width: 200px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px;">翻译选项</h4>
                <button id="text-translate-btn" style="width: 100%; padding: 8px; margin: 5px 0; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">文字翻译</button>
                <button id="voice-translate-btn" style="width: 100%; padding: 8px; margin: 5px 0; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer;">语音通话翻译</button>
                <button id="video-translate-btn" style="width: 100%; padding: 8px; margin: 5px 0; background: #f59e0b; color: white; border: none; border-radius: 5px; cursor: pointer;">视频通话翻译</button>
                <button id="close-translate-menu" style="width: 100%; padding: 8px; margin: 5px 0; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer;">关闭</button>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // 文字翻译
        menu.querySelector('#text-translate-btn').addEventListener('click', () => {
            menu.remove();
            this.translationManager.showTranslationPanel();
        });
        
        // 语音翻译
        menu.querySelector('#voice-translate-btn').addEventListener('click', () => {
            menu.remove();
            this.voiceTranslationManager.startVoiceTranslation();
        });
        
        // 视频通话翻译
        menu.querySelector('#video-translate-btn').addEventListener('click', () => {
            menu.remove();
            alert('视频通话翻译功能开发中...');
        });
        
        // 关闭
        menu.querySelector('#close-translate-menu').addEventListener('click', () => {
            menu.remove();
        });
    }
}

/**
 * 文字翻译管理器
 */
class TranslationManager {
    constructor() {
        this.sourceLang = 'zh';
        this.targetLang = 'en';
    }
    
    async translateText(text, sourceLang, targetLang) {
        try {
            // 使用 MyMemory 免费翻译 API
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
            );
            const data = await response.json();
            return data.responseData.translatedText;
        } catch (err) {
            console.error('Translation error:', err);
            return text;
        }
    }
    
    showTranslationPanel() {
        // 移除已存在的面板
        const existing = document.getElementById('translation-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'translation-panel';
        panel.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; min-width: 400px;">
                <h3 style="margin: 0 0 15px 0;">文字翻译</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
                    <select id="source-lang-select" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                        <option value="zh">中文</option>
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                    </select>
                    <span>→</span>
                    <select id="target-lang-select" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                        <option value="ar">العربية</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                    </select>
                </div>
                <textarea id="translate-input" placeholder="输入要翻译的文本..." style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px; resize: vertical;"></textarea>
                <div id="translate-output" style="background: #f5f5f5; padding: 10px; border-radius: 5px; min-height: 50px; margin-bottom: 15px;"></div>
                <div style="display: flex; gap: 10px;">
                    <button id="do-translate-btn" style="flex: 1; padding: 10px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">翻译</button>
                    <button id="send-translate-btn" style="flex: 1; padding: 10px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer;">发送翻译</button>
                    <button id="close-translate-panel" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer;">关闭</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 翻译按钮
        panel.querySelector('#do-translate-btn').addEventListener('click', async () => {
            const input = panel.querySelector('#translate-input').value;
            const sourceLang = panel.querySelector('#source-lang-select').value;
            const targetLang = panel.querySelector('#target-lang-select').value;
            const output = panel.querySelector('#translate-output');
            
            if (!input) {
                alert('请输入要翻译的文本');
                return;
            }
            
            output.textContent = '翻译中...';
            const translated = await this.translateText(input, sourceLang, targetLang);
            output.textContent = translated;
        });
        
        // 发送翻译按钮
        panel.querySelector('#send-translate-btn').addEventListener('click', () => {
            const output = panel.querySelector('#translate-output').textContent;
            if (output && output !== '翻译中...') {
                // 发送翻译后的文本
                if (window.chatApp && window.chatApp.sendMessage) {
                    window.chatApp.messageInput.value = output;
                    window.chatApp.sendMessage();
                    panel.remove();
                }
            }
        });
        
        // 关闭按钮
        panel.querySelector('#close-translate-panel').addEventListener('click', () => {
            panel.remove();
        });
    }
}

/**
 * 语音翻译管理器
 */
class VoiceTranslationManager {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.shouldTranslate = false;
        this.transcript = '';
    }
    
    startVoiceTranslation() {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            alert('您的浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器');
            return;
        }
        
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.recognition.lang = 'zh-CN';
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        
        this.transcript = '';
        this.shouldTranslate = false;
        
        this.recognition.onresult = async (event) => {
            const text = event.results[event.results.length - 1][0].transcript;
            console.log('语音识别结果:', text);
            
            // 检测关键词
            if (text.includes('开始翻译')) {
                this.shouldTranslate = true;
                this.transcript = '';
                this.showNotification(' 翻译已启动，请开始说话');
                return;
            }
            
            if (text.includes('发言完毕') && this.shouldTranslate) {
                this.shouldTranslate = false;
                
                // 翻译文本
                const translationManager = new TranslationManager();
                const translated = await translationManager.translateText(
                    this.transcript, 'zh', 'en'
                );
                
                // TTS 播放
                this.speak(translated);
                
                this.showNotification('✅ 翻译完成');
                this.showNotification(`翻译结果: ${translated}`);
                
                return;
            }
            
            if (this.shouldTranslate) {
                this.transcript += text;
                this.showNotification(`📝 正在录音... (${this.transcript.length} 字)`);
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                this.showNotification('⚠️ 未检测到语音，请重试');
            } else {
                this.showNotification('❌ 语音识别错误: ' + event.error);
            }
        };
        
        this.recognition.onend = () => {
            if (this.isRecording) {
                // 自动重启
                setTimeout(() => {
                    if (this.isRecording) {
                        this.recognition.start();
                    }
                }, 100);
            }
        };
        
        this.recognition.start();
        this.isRecording = true;
        
        this.showNotification('🎤 语音翻译已启动\n说"开始翻译"开始，说"发言完毕"结束');
        
        // 30秒后自动停止
        setTimeout(() => {
            if (this.isRecording) {
                this.stopVoiceTranslation();
            }
        }, 30000);
    }
    
    stopVoiceTranslation() {
        if (this.recognition) {
            this.recognition.stop();
            this.isRecording = false;
            this.showNotification('⏹️ 语音翻译已停止');
        }
    }
    
    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        }
    }
    
    showNotification(message) {
        console.log('[语音翻译]', message);
        // 可以在这里添加 UI 通知
    }
}

// 导出
window.EnhancedFeatures = EnhancedFeatures;
window.TranslationManager = TranslationManager;
window.VoiceTranslationManager = VoiceTranslationManager;
