/**
 * 翻译功能管理器
 * 包括：文字翻译、语音翻译、视频通话翻译
 */

class TranslationManager {
    constructor() {
        this.isTranslating = false;
        this.sourceLang = 'auto';
        this.targetLang = 'en';
        this.translationCache = new Map();
        
        // 语音消息翻译配置
        this.voiceTranslationConfig = {
            myVoiceLang: 'zh-CN',      // 本人语音语言
            myTextLang: 'zh',           // 本人文字语言
            partnerVoiceLang: 'en-US',  // 聊天对象语音语言
            partnerTextLang: 'en'       // 聊天对象文字语言
        };
        
        // 从 localStorage 加载配置
        this.loadVoiceTranslationConfig();
    }
    
    // 初始化翻译界面
    initTranslationUI() {
        this.createTranslationModal();
        this.bindTranslationButtons();
    }
    
    // 创建翻译弹窗
    createTranslationModal() {
        if (document.getElementById('translation-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'translation-modal';
        modal.className = 'translation-modal hidden';
        modal.innerHTML = `
            <div class="translation-modal-content">
                <div class="translation-header">
                    <h3>🌐 翻译设置</h3>
                    <button id="close-translation-btn" class="close-btn">×</button>
                </div>
                
                <div class="translation-type-selector">
                    <button class="type-btn active" data-type="text">
                        <span class="icon">📝</span>
                        <span>文字翻译</span>
                    </button>
                    <button class="type-btn" data-type="voice">
                        <span class="icon">🎤</span>
                        <span>语音翻译</span>
                    </button>
                    <button class="type-btn" data-type="video">
                        <span class="icon">📹</span>
                        <span>视频翻译</span>
                    </button>
                    <button class="type-btn" data-type="voice-message">
                        <span class="icon">💬</span>
                        <span>语音消息</span>
                    </button>
                </div>
                
                <!-- 文字翻译 -->
                <div id="text-translation-panel" class="translation-panel active">
                    <div class="language-selector">
                        <div class="lang-group">
                            <label>输入语言：</label>
                            <select id="source-lang-select">
                                <option value="auto">自动检测</option>
                                <option value="zh">中文</option>
                                <option value="en">英语</option>
                                <option value="ja">日语</option>
                                <option value="ko">韩语</option>
                                <option value="fr">法语</option>
                                <option value="de">德语</option>
                                <option value="es">西班牙语</option>
                                <option value="ru">俄语</option>
                                <option value="ar">阿拉伯语</option>
                            </select>
                        </div>
                        
                        <div class="lang-swap-btn" id="swap-langs-btn">⇄</div>
                        
                        <div class="lang-group">
                            <label>输出语言：</label>
                            <select id="target-lang-select">
                                <option value="en">英语</option>
                                <option value="zh">中文</option>
                                <option value="ja">日语</option>
                                <option value="ko">韩语</option>
                                <option value="fr">法语</option>
                                <option value="de">德语</option>
                                <option value="es">西班牙语</option>
                                <option value="ru">俄语</option>
                                <option value="ar">阿拉伯语</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="translation-input-area">
                        <textarea id="translation-input" placeholder="输入要翻译的文字..."></textarea>
                        <div class="translation-output" id="translation-output">
                            <div class="output-placeholder">翻译结果将显示在这里...</div>
                        </div>
                    </div>
                    
                    <div class="translation-actions">
                        <button id="translate-btn" class="primary-btn">翻译</button>
                        <button id="copy-translation-btn" class="secondary-btn">复制译文</button>
                        <button id="send-translation-btn" class="success-btn">发送译文</button>
                    </div>
                </div>
                
                <!-- 语音翻译 -->
                <div id="voice-translation-panel" class="translation-panel">
                    <div class="voice-translation-info">
                        <div class="info-icon">ℹ️</div>
                        <div class="info-text">
                            <p><strong>使用说明：</strong></p>
                            <ol>
                                <li>说话前先说"<strong>开始翻译</strong>"</li>
                                <li>系统会自动录音并翻译</li>
                                <li>说完后说"<strong>发言完毕</strong>"</li>
                                <li>系统会播放翻译后的语音</li>
                            </ol>
                        </div>
                    </div>
                    
                    <div class="language-selector">
                        <div class="lang-group">
                            <label>输入语言：</label>
                            <select id="voice-source-lang">
                                <option value="zh-CN">中文</option>
                                <option value="en-US">英语</option>
                                <option value="ja-JP">日语</option>
                                <option value="ko-KR">韩语</option>
                            </select>
                        </div>
                        
                        <div class="lang-group">
                            <label>输出语言：</label>
                            <select id="voice-target-lang">
                                <option value="en-US">英语</option>
                                <option value="zh-CN">中文</option>
                                <option value="ja-JP">日语</option>
                                <option value="ko-KR">韩语</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="voice-translation-controls">
                        <button id="start-voice-translation-btn" class="primary-btn large-btn">
                            <span class="btn-icon">🎤</span>
                            <span>开始语音翻译</span>
                        </button>
                        <button id="stop-voice-translation-btn" class="danger-btn large-btn" disabled>
                            <span class="btn-icon">⏹️</span>
                            <span>停止</span>
                        </button>
                    </div>
                    
                    <div class="voice-translation-status" id="voice-translation-status">
                        <div class="status-indicator">准备就绪</div>
                    </div>
                </div>
                
                <!-- 视频翻译（同语音翻译） -->
                <div id="video-translation-panel" class="translation-panel">
                    <div class="video-translation-info">
                        <div class="info-icon">ℹ️</div>
                        <div class="info-text">
                            <p><strong>使用说明：</strong></p>
                            <ol>
                                <li>在视频通话中点击此按钮</li>
                                <li>说话前说"<strong>开始翻译</strong>"</li>
                                <li>说完后说"<strong>发言完毕</strong>"</li>
                                <li>对方会听到翻译后的语音</li>
                            </ol>
                        </div>
                    </div>
                    
                    <div class="language-selector">
                        <div class="lang-group">
                            <label>输入语言：</label>
                            <select id="video-source-lang">
                                <option value="zh-CN">中文</option>
                                <option value="en-US">英语</option>
                                <option value="ja-JP">日语</option>
                            </select>
                        </div>
                        
                        <div class="lang-group">
                            <label>输出语言：</label>
                            <select id="video-target-lang">
                                <option value="en-US">英语</option>
                                <option value="zh-CN">中文</option>
                                <option value="ja-JP">日语</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="video-translation-controls">
                        <button id="start-video-translation-btn" class="primary-btn large-btn">
                            <span class="btn-icon">📹</span>
                            <span>开始视频翻译</span>
                        </button>
                    </div>
                </div>
                
                <!-- 语音消息翻译设置 -->
                <div id="voice-message-translation-panel" class="translation-panel">
                    <div class="voice-message-info">
                        <div class="info-icon">ℹ️</div>
                        <div class="info-text">
                            <p><strong>使用说明：</strong></p>
                            <ol>
                                <li>配置您和聊天对象的语言偏好</li>
                                <li>点击语音消息的“三个点”图标</li>
                                <li>选择“转换文字”或“转换并播放”</li>
                                <li>系统自动识别、翻译、播放</li>
                            </ol>
                        </div>
                    </div>
                    
                    <div class="voice-config-section">
                        <h4>👤 本人设置</h4>
                        <div class="language-selector">
                            <div class="lang-group">
                                <label>我的语音语言：</label>
                                <select id="my-voice-lang">
                                    <option value="zh-CN">中文</option>
                                    <option value="en-US">英语</option>
                                    <option value="ja-JP">日语</option>
                                    <option value="ko-KR">韩语</option>
                                    <option value="fr-FR">法语</option>
                                    <option value="de-DE">德语</option>
                                </select>
                            </div>
                            
                            <div class="lang-group">
                                <label>我想看到的文字：</label>
                                <select id="my-text-lang">
                                    <option value="zh">中文</option>
                                    <option value="en">英语</option>
                                    <option value="ja">日语</option>
                                    <option value="ko">韩语</option>
                                    <option value="fr">法语</option>
                                    <option value="de">德语</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="voice-config-section">
                        <h4>👥 聊天对象设置</h4>
                        <div class="language-selector">
                            <div class="lang-group">
                                <label>对方的语音语言：</label>
                                <select id="partner-voice-lang">
                                    <option value="en-US">英语</option>
                                    <option value="zh-CN">中文</option>
                                    <option value="ja-JP">日语</option>
                                    <option value="ko-KR">韩语</option>
                                    <option value="fr-FR">法语</option>
                                    <option value="de-DE">德语</option>
                                </select>
                            </div>
                            
                            <div class="lang-group">
                                <label>对方想看到的文字：</label>
                                <select id="partner-text-lang">
                                    <option value="en">英语</option>
                                    <option value="zh">中文</option>
                                    <option value="ja">日语</option>
                                    <option value="ko">韩语</option>
                                    <option value="fr">法语</option>
                                    <option value="de">德语</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="translation-actions">
                        <button id="save-voice-config-btn" class="success-btn">保存配置</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 绑定事件
        this.bindModalEvents();
    }
    
    // 绑定弹窗事件
    bindModalEvents() {
        // 关闭按钮
        const closeBtn = document.getElementById('close-translation-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideTranslationModal());
        }
        
        // 类型切换
        const typeBtns = document.querySelectorAll('.type-btn');
        typeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                typeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const type = btn.dataset.type;
                document.querySelectorAll('.translation-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                document.getElementById(`${type}-translation-panel`).classList.add('active');
            });
        });
        
        // 语言交换
        const swapBtn = document.getElementById('swap-langs-btn');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => {
                const sourceSelect = document.getElementById('source-lang-select');
                const targetSelect = document.getElementById('target-lang-select');
                
                const temp = sourceSelect.value;
                sourceSelect.value = targetSelect.value;
                targetSelect.value = temp;
            });
        }
        
        // 翻译按钮
        const translateBtn = document.getElementById('translate-btn');
        if (translateBtn) {
            translateBtn.addEventListener('click', () => this.translateText());
        }
        
        // 复制译文
        const copyBtn = document.getElementById('copy-translation-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyTranslation());
        }
        
        // 发送译文
        const sendBtn = document.getElementById('send-translation-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendTranslation());
        }
        
        // 语音翻译按钮
        const startVoiceBtn = document.getElementById('start-voice-translation-btn');
        if (startVoiceBtn) {
            startVoiceBtn.addEventListener('click', () => this.startVoiceTranslation());
        }
        
        const stopVoiceBtn = document.getElementById('stop-voice-translation-btn');
        if (stopVoiceBtn) {
            stopVoiceBtn.addEventListener('click', () => this.stopVoiceTranslation());
        }
        
        // 保存语音消息翻译配置
        const saveConfigBtn = document.getElementById('save-voice-config-btn');
        if (saveConfigBtn) {
            saveConfigBtn.addEventListener('click', () => this.saveVoiceMessageConfig());
        }
        
        // 加载配置到表单
        this.loadConfigToForm();
    }
    
    // 绑定翻译按钮
    bindTranslationButtons() {
        // 主界面的翻译按钮
        const translateToggleBtn = document.getElementById('translate-toggle-btn');
        if (translateToggleBtn) {
            translateToggleBtn.addEventListener('click', () => {
                this.showTranslationModal();
            });
        }
    }
    
    // 显示翻译弹窗
    showTranslationModal() {
        const modal = document.getElementById('translation-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    // 隐藏翻译弹窗
    hideTranslationModal() {
        const modal = document.getElementById('translation-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    // 翻译文字
    async translateText() {
        const input = document.getElementById('translation-input');
        const output = document.getElementById('translation-output');
        const sourceLang = document.getElementById('source-lang-select').value;
        const targetLang = document.getElementById('target-lang-select').value;
        
        if (!input || !output) return;
        
        const text = input.value.trim();
        if (!text) {
            alert('请输入要翻译的文字');
            return;
        }
        
        // 检查缓存
        const cacheKey = `${text}_${sourceLang}_${targetLang}`;
        if (this.translationCache.has(cacheKey)) {
            output.innerHTML = `<div class="translated-text">${this.translationCache.get(cacheKey)}</div>`;
            return;
        }
        
        try {
            output.innerHTML = '<div class="translating">翻译中...</div>';
            
            // 调用 MyMemory 免费翻译 API
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang === 'auto' ? 'Autodetect' : sourceLang}|${targetLang}`
            );
            
            const data = await response.json();
            
            if (data.responseStatus === 200) {
                const translatedText = data.responseData.translatedText;
                this.translationCache.set(cacheKey, translatedText);
                output.innerHTML = `<div class="translated-text">${translatedText}</div>`;
            } else {
                output.innerHTML = '<div class="error">翻译失败，请稍后重试</div>';
            }
        } catch (err) {
            console.error('Translation error:', err);
            output.innerHTML = '<div class="error">网络错误，请检查网络连接</div>';
        }
    }
    
    // 复制译文
    copyTranslation() {
        const output = document.getElementById('translation-output');
        if (!output) return;
        
        const text = output.querySelector('.translated-text')?.textContent;
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('译文已复制到剪贴板');
            }).catch(err => {
                console.error('Copy error:', err);
                alert('复制失败');
            });
        }
    }
    
    // 发送译文
    sendTranslation() {
        const output = document.getElementById('translation-output');
        if (!output) return;
        
        const text = output.querySelector('.translated-text')?.textContent;
        if (text && window.chatApp && window.chatApp.socket && window.chatApp.currentChat) {
            window.chatApp.socket.emit('send_message', {
                to: window.chatApp.currentChat,
                content: `[翻译] ${text}`,
                isTranslated: true
            });
            
            this.hideTranslationModal();
        } else {
            alert('请先选择聊天对象');
        }
    }
    
    // 开始语音翻译
    async startVoiceTranslation() {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('您的浏览器不支持语音识别');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        const sourceLang = document.getElementById('voice-source-lang').value;
        const targetLang = document.getElementById('voice-target-lang').value;
        
        recognition.lang = sourceLang;
        recognition.continuous = true;
        recognition.interimResults = true;
        
        let fullTranscript = '';
        let isRecording = false;
        
        recognition.onstart = () => {
            isRecording = true;
            document.getElementById('voice-translation-status').innerHTML = 
                '<div class="status-indicator recording">🔴 正在录音...请说"开始翻译"</div>';
            document.getElementById('start-voice-translation-btn').disabled = true;
            document.getElementById('stop-voice-translation-btn').disabled = false;
        };
        
        recognition.onresult = async (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            fullTranscript += finalTranscript;
            
            // 检测关键词
            if (finalTranscript.includes('开始翻译') || finalTranscript.includes('start translation')) {
                document.getElementById('voice-translation-status').innerHTML = 
                    '<div class="status-indicator processing">⚙️ 正在翻译...</div>';
                fullTranscript = ''; // 清空，开始正式录音
            }
            
            if (finalTranscript.includes('发言完毕') || finalTranscript.includes('finished')) {
                // 停止录音并翻译
                recognition.stop();
                await this.processVoiceTranslation(fullTranscript, targetLang);
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            document.getElementById('voice-translation-status').innerHTML = 
                `<div class="status-indicator error">❌ 错误: ${event.error}</div>`;
        };
        
        recognition.onend = () => {
            if (isRecording) {
                recognition.start(); // 自动重启
            }
        };
        
        recognition.start();
        
        // 保存引用以便停止
        this.currentRecognition = recognition;
    }
    
    // 处理语音翻译
    async processVoiceTranslation(text, targetLang) {
        if (!text.trim()) {
            document.getElementById('voice-translation-status').innerHTML = 
                '<div class="status-indicator">未检测到语音</div>';
            return;
        }
        
        try {
            document.getElementById('voice-translation-status').innerHTML = 
                '<div class="status-indicator processing">⚙️ 正在翻译...</div>';
            
            // 翻译文本
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=Autodetect|${targetLang}`
            );
            
            const data = await response.json();
            
            if (data.responseStatus === 200) {
                const translatedText = data.responseData.translatedText;
                
                // 文字转语音
                this.speak(translatedText, targetLang);
                
                document.getElementById('voice-translation-status').innerHTML = 
                    '<div class="status-indicator success">✅ 翻译完成，正在播放</div>';
            }
        } catch (err) {
            console.error('Voice translation error:', err);
            document.getElementById('voice-translation-status').innerHTML = 
                '<div class="status-indicator error">❌ 翻译失败</div>';
        }
    }
    
    // 停止语音翻译
    stopVoiceTranslation() {
        if (this.currentRecognition) {
            this.currentRecognition.stop();
            this.currentRecognition = null;
        }
        
        document.getElementById('voice-translation-status').innerHTML = 
            '<div class="status-indicator">已停止</div>';
        document.getElementById('start-voice-translation-btn').disabled = false;
        document.getElementById('stop-voice-translation-btn').disabled = true;
    }
    
    // 文字转语音
    speak(text, lang) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            window.speechSynthesis.speak(utterance);
        }
    }
    
    // 加载语音翻译配置
    loadVoiceTranslationConfig() {
        const saved = localStorage.getItem('voiceTranslationConfig');
        if (saved) {
            try {
                this.voiceTranslationConfig = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load voice translation config:', e);
            }
        }
    }
    
    // 保存语音翻译配置
    saveVoiceTranslationConfig() {
        localStorage.setItem('voiceTranslationConfig', JSON.stringify(this.voiceTranslationConfig));
    }
    
    // 保存语音消息配置（从表单）
    saveVoiceMessageConfig() {
        const myVoiceLang = document.getElementById('my-voice-lang')?.value;
        const myTextLang = document.getElementById('my-text-lang')?.value;
        const partnerVoiceLang = document.getElementById('partner-voice-lang')?.value;
        const partnerTextLang = document.getElementById('partner-text-lang')?.value;
        
        if (myVoiceLang && myTextLang && partnerVoiceLang && partnerTextLang) {
            this.voiceTranslationConfig = {
                myVoiceLang,
                myTextLang,
                partnerVoiceLang,
                partnerTextLang
            };
            
            this.saveVoiceTranslationConfig();
            this.showNotification('✅ 配置已保存');
        } else {
            this.showNotification('❌ 请填写所有选项');
        }
    }
    
    // 加载配置到表单
    loadConfigToForm() {
        setTimeout(() => {
            const myVoiceSelect = document.getElementById('my-voice-lang');
            const myTextSelect = document.getElementById('my-text-lang');
            const partnerVoiceSelect = document.getElementById('partner-voice-lang');
            const partnerTextSelect = document.getElementById('partner-text-lang');
            
            if (myVoiceSelect) myVoiceSelect.value = this.voiceTranslationConfig.myVoiceLang;
            if (myTextSelect) myTextSelect.value = this.voiceTranslationConfig.myTextLang;
            if (partnerVoiceSelect) partnerVoiceSelect.value = this.voiceTranslationConfig.partnerVoiceLang;
            if (partnerTextSelect) partnerTextSelect.value = this.voiceTranslationConfig.partnerTextLang;
        }, 100);
    }
    
    // 处理语音消息翻译（从消息菜单调用）
    async translateVoiceMessage(audioUrl, isPartnerMessage = true) {
        try {
            // 显示加载提示
            const loadingMsg = isPartnerMessage ? '正在识别对方语音...' : '正在识别您的语音...';
            this.showNotification(loadingMsg);
            
            // 1. 下载音频文件
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            
            // 2. 调用阿里云 ASR 进行语音识别
            const formData = new FormData();
            formData.append('audio', blob, 'voice-message.webm');
            
            const asrResponse = await fetch('/api/voice/transcribe-aliyun', {
                method: 'POST',
                body: formData
            });
            
            const asrResult = await asrResponse.json();
            
            if (!asrResult.success) {
                throw new Error(asrResult.error || '语音识别失败');
            }
            
            const originalText = asrResult.text;
            
            // 3. 根据配置决定如何处理
            if (isPartnerMessage) {
                // 对方的语音：识别 → 翻译成我的文字
                const targetLang = this.voiceTranslationConfig.partnerTextLang;
                const translatedText = await this.translateTextAPI(originalText, 'auto', targetLang);
                
                // 显示翻译结果
                this.showTranslatedText(translatedText, originalText);
                
                return {
                    originalText,
                    translatedText,
                    success: true
                };
            } else {
                // 我的语音：识别 → 翻译成对方文字 → TTS播放
                const targetLang = this.voiceTranslationConfig.myTextLang;
                const translatedText = await this.translateTextAPI(originalText, 'auto', targetLang);
                
                // TTS 播放
                this.speak(translatedText, this.voiceTranslationConfig.myVoiceLang);
                
                // 显示翻译结果
                this.showTranslatedText(translatedText, originalText, true);
                
                return {
                    originalText,
                    translatedText,
                    success: true
                };
            }
        } catch (err) {
            console.error('Voice message translation error:', err);
            this.showNotification('翻译失败: ' + err.message);
            return { success: false, error: err.message };
        }
    }
    
    // 调用翻译 API
    async translateTextAPI(text, sourceLang, targetLang) {
        const cacheKey = `${text}_${sourceLang}_${targetLang}`;
        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }
        
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang === 'auto' ? 'Autodetect' : sourceLang}|${targetLang}`
            );
            
            const data = await response.json();
            
            if (data.responseStatus === 200) {
                const translatedText = data.responseData.translatedText;
                this.translationCache.set(cacheKey, translatedText);
                return translatedText;
            } else {
                throw new Error('Translation API error');
            }
        } catch (err) {
            console.error('Translation API error:', err);
            return text; // 返回原文
        }
    }
    
    // 显示翻译结果
    showTranslatedText(translatedText, originalText, withTTS = false) {
        const container = document.createElement('div');
        container.className = 'translation-result-popup';
        container.innerHTML = `
            <div class="translation-result-content">
                <div class="result-header">
                    <h4>🌐 翻译结果</h4>
                    <button class="close-result-btn">×</button>
                </div>
                <div class="result-body">
                    <div class="original-text">
                        <label>原文：</label>
                        <p>${originalText}</p>
                    </div>
                    <div class="translated-text">
                        <label>译文：</label>
                        <p>${translatedText}</p>
                    </div>
                    ${withTTS ? '<div class="tts-indicator">🔊 正在播放译文语音...</div>' : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // 关闭按钮
        const closeBtn = container.querySelector('.close-result-btn');
        closeBtn.addEventListener('click', () => {
            container.remove();
        });
        
        // 5秒后自动关闭
        setTimeout(() => {
            if (container.parentNode) {
                container.remove();
            }
        }, 8000);
    }
    
    // 显示通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 100001;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// 导出到全局
window.TranslationManager = TranslationManager;
