/**
 * 完整的语音/视频通话功能实现
 * 包括：发起通话、接听、拒接、挂断、移动端适配
 */

class VoiceVideoCallManager {
    constructor(chatApp) {
        this.chatApp = chatApp;
        this.socket = chatApp.socket;
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.currentCall = null;
        this.isCallActive = false;
        this.callType = null; // 'voice' or 'video'
        
        // WebRTC ICE 服务器配置
        this.rtcConfig = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.bindCallButtons();
        this.setupSocketListeners();
        this.createCallModal();
    }
    
    // 绑定通话按钮
    bindCallButtons() {
        // 语音通话按钮
        const voiceCallBtn = document.getElementById('voice-call-btn');
        if (voiceCallBtn) {
            voiceCallBtn.addEventListener('click', () => {
                console.log('[VoiceCall] Voice call button clicked');
                this.startCall('voice');
            });
        }
        
        // 视频通话按钮（输入区）
        const videoCallBtns = document.querySelectorAll('#video-call-btn');
        videoCallBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('[VoiceCall] Video call button clicked');
                this.startCall('video');
            });
        });
    }
    
    // 创建通话界面
    createCallModal() {
        // 检查是否已存在
        if (document.getElementById('call-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'call-modal';
        modal.className = 'call-modal hidden';
        modal.innerHTML = `
            <div class="call-modal-content">
                <div class="call-header">
                    <h3 id="call-title">语音通话中...</h3>
                    <div id="call-status" class="call-status">连接中...</div>
                </div>
                
                <div class="call-videos">
                    <div class="video-container" id="remote-video-container" style="display: none;">
                        <video id="remote-video" autoplay playsinline></video>
                        <div class="video-label">对方</div>
                    </div>
                    <div class="video-container" id="local-video-container" style="display: none;">
                        <video id="local-video" autoplay playsinline muted></video>
                        <div class="video-label">我</div>
                    </div>
                </div>
                
                <div class="call-avatar" id="call-avatar" style="display: block;">
                    <div class="avatar-circle">👤</div>
                    <div class="avatar-name" id="caller-name">对方</div>
                </div>
                
                <div class="call-controls">
                    <button id="mute-btn" class="call-btn mute-btn" title="静音">
                        <span id="mute-icon">🎤</span>
                        <span>静音</span>
                    </button>
                    <button id="end-call-btn" class="call-btn end-call-btn" title="挂断">
                        <span>📞</span>
                        <span>挂断</span>
                    </button>
                    <button id="switch-camera-btn" class="call-btn switch-btn" title="切换摄像头" style="display: none;">
                        <span>📷</span>
                        <span>切换</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 绑定按钮事件
        const endCallBtn = document.getElementById('end-call-btn');
        if (endCallBtn) {
            endCallBtn.addEventListener('click', () => this.endCall());
        }
        
        const muteBtn = document.getElementById('mute-btn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => this.toggleMute());
        }
        
        const switchCameraBtn = document.getElementById('switch-camera-btn');
        if (switchCameraBtn) {
            switchCameraBtn.addEventListener('click', () => this.switchCamera());
        }
    }
    
    // 设置 Socket 监听
    setupSocketListeners() {
        // 监听来电
        this.socket.on('video_call', (data) => {
            console.log('[VoiceCall] Incoming call:', data);
            this.handleIncomingCall(data);
        });
        
        // 监听接听
        this.socket.on('answer_call', (data) => {
            console.log('[VoiceCall] Call answered:', data);
            this.handleCallAnswered(data);
        });
        
        // 监听拒接
        this.socket.on('call_rejected', (data) => {
            console.log('[VoiceCall] Call rejected:', data);
            this.handleCallRejected();
        });
        
        // 监听挂断
        this.socket.on('end_call', (data) => {
            console.log('[VoiceCall] Call ended:', data);
            this.handleRemoteCallEnd();
        });
        
        // 监听 ICE 候选
        this.socket.on('ice_candidate', (data) => {
            console.log('[VoiceCall] ICE candidate received');
            this.handleIceCandidate(data);
        });
    }
    
    // 发起通话
    async startCall(type) {
        if (!this.chatApp.currentChat) {
            alert('请先选择一个聊天对象');
            return;
        }
        
        if (this.isCallActive) {
            alert('当前已有通话进行中');
            return;
        }
        
        try {
            this.callType = type;
            
            // 获取媒体流
            const constraints = {
                audio: true,
                video: type === 'video' ? { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                } : false
            };
            
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // 创建 PeerConnection
            this.createPeerConnection();
            
            // 添加本地流
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            
            // 显示本地视频
            if (type === 'video') {
                const localVideo = document.getElementById('local-video');
                if (localVideo) {
                    localVideo.srcObject = this.localStream;
                }
                document.getElementById('local-video-container').style.display = 'block';
                document.getElementById('switch-camera-btn').style.display = 'flex';
            }
            
            // 创建 Offer
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            
            // 发送到对方
            this.socket.emit('video_call', {
                to: this.chatApp.currentChat,
                signal: offer,
                callType: type,
                fromUsername: this.chatApp.currentUser?.username || '我'
            });
            
            // 显示通话界面
            this.showCallUI('outgoing');
            
        } catch (err) {
            console.error('[VoiceCall] Start call error:', err);
            alert('无法启动通话: ' + err.message);
        }
    }
    
    // 处理来电
    handleIncomingCall(data) {
        console.log('[VoiceCall] Handling incoming call from:', data.fromUsername);
        
        // 显示来电通知
        if (confirm(`来自 ${data.fromUsername} 的${data.callType === 'video' ? '视频' : '语音'}通话，是否接听？`)) {
            this.answerCall(data);
        } else {
            this.rejectCall(data.from);
        }
    }
    
    // 接听通话
    async answerCall(data) {
        try {
            this.callType = data.callType || 'video';
            this.currentCall = data.from;
            
            // 获取媒体流
            const constraints = {
                audio: true,
                video: this.callType === 'video' ? { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                } : false
            };
            
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // 创建 PeerConnection
            this.createPeerConnection();
            
            // 添加本地流
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });
            
            // 显示本地视频
            if (this.callType === 'video') {
                const localVideo = document.getElementById('local-video');
                if (localVideo) {
                    localVideo.srcObject = this.localStream;
                }
                document.getElementById('local-video-container').style.display = 'block';
                document.getElementById('switch-camera-btn').style.display = 'flex';
            }
            
            // 设置远程描述
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
            
            // 创建 Answer
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            
            // 发送 Answer
            this.socket.emit('answer_call', {
                to: data.from,
                signal: answer,
                callType: this.callType
            });
            
            // 显示通话界面
            this.showCallUI('incoming');
            document.getElementById('caller-name').textContent = data.fromUsername || '对方';
            
        } catch (err) {
            console.error('[VoiceCall] Answer call error:', err);
            alert('接听失败: ' + err.message);
        }
    }
    
    // 拒接通话
    rejectCall(toUserId) {
        this.socket.emit('call_rejected', { to: toUserId });
        alert('已拒接来电');
    }
    
    // 处理拒接
    handleCallRejected() {
        this.endCall();
        alert('对方拒接来电');
    }
    
    // 处理接听
    async handleCallAnswered(data) {
        try {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
            console.log('[VoiceCall] Call answered successfully');
        } catch (err) {
            console.error('[VoiceCall] Handle answer error:', err);
        }
    }
    
    // 处理远程挂断
    handleRemoteCallEnd() {
        alert('通话已结束');
        this.endCall();
    }
    
    // 处理 ICE 候选
    async handleIceCandidate(data) {
        try {
            if (this.peerConnection && data.candidate) {
                await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        } catch (err) {
            console.error('[VoiceCall] ICE candidate error:', err);
        }
    }
    
    // 创建 PeerConnection
    createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(this.rtcConfig);
        
        // 监听远程流
        this.peerConnection.ontrack = (event) => {
            console.log('[VoiceCall] Remote track received:', event.track.kind);
            this.remoteStream = event.streams[0];
            
            if (event.track.kind === 'video') {
                const remoteVideo = document.getElementById('remote-video');
                if (remoteVideo) {
                    remoteVideo.srcObject = this.remoteStream;
                }
                document.getElementById('remote-video-container').style.display = 'block';
            }
            
            // 更新通话状态
            document.getElementById('call-status').textContent = '通话中';
            this.isCallActive = true;
        };
        
        // 监听 ICE 候选
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate && this.currentCall) {
                this.socket.emit('ice_candidate', {
                    to: this.currentCall,
                    candidate: event.candidate
                });
            }
        };
        
        // 监听连接状态
        this.peerConnection.onconnectionstatechange = () => {
            console.log('[VoiceCall] Connection state:', this.peerConnection.connectionState);
            
            if (this.peerConnection.connectionState === 'disconnected' || 
                this.peerConnection.connectionState === 'failed') {
                alert('通话连接已断开');
                this.endCall();
            }
        };
    }
    
    // 显示通话界面
    showCallUI(direction) {
        const modal = document.getElementById('call-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
        
        const title = document.getElementById('call-title');
        const status = document.getElementById('call-status');
        
        if (direction === 'outgoing') {
            if (title) title.textContent = `${this.callType === 'video' ? '视频' : '语音'}通话中...`;
            if (status) status.textContent = '等待对方接听...';
        } else {
            if (title) title.textContent = `通话中`;
            if (status) status.textContent = '连接中...';
        }
    }
    
    // 静音/取消静音
    toggleMute() {
        if (!this.localStream) return;
        
        const audioTrack = this.localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            
            const muteIcon = document.getElementById('mute-icon');
            if (muteIcon) {
                muteIcon.textContent = audioTrack.enabled ? '🎤' : '🔇';
            }
        }
    }
    
    // 切换摄像头（前后）
    async switchCamera() {
        if (!this.localStream) return;
        
        try {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (!videoTrack) return;
            
            const currentFacing = videoTrack.getSettings().facingMode;
            const newFacing = currentFacing === 'user' ? 'environment' : 'user';
            
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newFacing },
                audio: false
            });
            
            const newVideoTrack = newStream.getVideoTracks()[0];
            
            // 替换轨道
            const sender = this.peerConnection.getSenders().find(s => s.track.kind === 'video');
            if (sender) {
                await sender.replaceTrack(newVideoTrack);
            }
            
            // 更新本地视频
            const localVideo = document.getElementById('local-video');
            if (localVideo) {
                localVideo.srcObject = newStream;
            }
            
            // 停止旧轨道
            this.localStream.getVideoTracks().forEach(track => track.stop());
            
            // 更新流
            const audioTrack = this.localStream.getAudioTracks()[0];
            this.localStream = new MediaStream([audioTrack, newVideoTrack]);
            
        } catch (err) {
            console.error('[VoiceCall] Switch camera error:', err);
            alert('切换摄像头失败: ' + err.message);
        }
    }
    
    // 结束通话
    endCall() {
        console.log('[VoiceCall] Ending call');
        
        // 关闭 PeerConnection
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        
        // 停止本地流
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        
        // 清除远程流
        this.remoteStream = null;
        
        // 通知对方
        if (this.currentCall) {
            this.socket.emit('end_call', { to: this.currentCall });
            this.currentCall = null;
        }
        
        // 隐藏通话界面
        const modal = document.getElementById('call-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        
        // 重置视频容器
        document.getElementById('local-video-container').style.display = 'none';
        document.getElementById('remote-video-container').style.display = 'none';
        document.getElementById('switch-camera-btn').style.display = 'none';
        
        // 重置状态
        this.isCallActive = false;
        this.callType = null;
    }
}

// 导出到全局
window.VoiceVideoCallManager = VoiceVideoCallManager;
