// 消息通知声音模块
class NotificationSound {
    constructor() {
        this.audioContext = null;
        this.isEnabled = true;
        this.volume = 0.3;
    }

    // 初始化音频上下文
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // 播放新消息提示音
    playNewMessage() {
        if (!this.isEnabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // 创建一个简短的"叮"声
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 设置音调
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        
        // 设置音量包络
        gainNode.gain.setValueAtTime(this.volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        // 播放声音
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }

    // 播放系统提示音（用于错误、警告等）
    playSystemSound(type = 'info') {
        if (!this.isEnabled || !this.audioContext) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        if (type === 'error') {
            oscillator.frequency.setValueAtTime(300, now);
            oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.2);
            gainNode.gain.setValueAtTime(this.volume * 0.8, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            oscillator.start(now);
            oscillator.stop(now + 0.4);
        } else if (type === 'success') {
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.setValueAtTime(800, now + 0.1);
            gainNode.gain.setValueAtTime(this.volume, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
        } else {
            // info
            oscillator.frequency.setValueAtTime(500, now);
            gainNode.gain.setValueAtTime(this.volume * 0.7, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
        }
    }

    // 启用/禁用通知声音
    toggle() {
        this.isEnabled = !this.isEnabled;
        localStorage.setItem('chat_notification_sound', this.isEnabled);
        return this.isEnabled;
    }

    // 设置音量
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('chat_notification_volume', this.volume);
    }

    // 从本地存储加载设置
    loadSettings() {
        const savedEnabled = localStorage.getItem('chat_notification_sound');
        const savedVolume = localStorage.getItem('chat_notification_volume');
        
        if (savedEnabled !== null) {
            this.isEnabled = savedEnabled === 'true';
        }
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
        }
    }
}

// 创建全局实例
const notificationSound = new NotificationSound();
