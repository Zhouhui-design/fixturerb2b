import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Phone, Mail, Clock, User, Paperclip, Image as ImageIcon, FileText, Video, X as CloseIcon, Mic, MicOff, PhoneOff, PhoneCall, Video as VideoIcon, Camera, CameraOff, Languages, Globe, Volume2, VolumeX, Subtitles } from 'lucide-react'
import { Button } from './ui/button'
import { supabase } from '../lib/supabase'
import { 
  translateText, 
  getSupportedLanguages,
  textToSpeech,
  stopSpeech,
  translateVoiceMessage,
  RealTimeSubtitleGenerator,
  checkVoiceCapabilities,
  type VoiceTranslationResult
} from '../services/translationService'

interface Attachment {
  id: string
  type: 'image' | 'video' | 'file'
  name: string
  url: string
  size: number
}

interface Message {
  id: string
  content: string
  sender: 'user' | 'admin'
  timestamp: string
  status?: 'sent' | 'delivered' | 'read'
  attachments?: Attachment[]
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [step, setStep] = useState<'intro' | 'chat'>('intro')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showAttachmentPicker, setShowAttachmentPicker] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Voice call states
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isCalling, setIsCalling] = useState(false)
  const [callType, setCallType] = useState<'voice' | 'video'>('voice')
  
  // Translation states
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(false)
  const [sourceLanguage, setSourceLanguage] = useState('auto')
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [showLanguagePicker, setShowLanguagePicker] = useState(false)
  
  // Advanced translation states
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  const [voiceTranslationResult, setVoiceTranslationResult] = useState<VoiceTranslationResult | null>(null)
  const [subtitleGenerator, setSubtitleGenerator] = useState<RealTimeSubtitleGenerator | null>(null)
  const [realtimeSubtitles, setRealtimeSubtitles] = useState<{ original: string; translated: string } | null>(null)
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true)
  const [voiceCapabilities, setVoiceCapabilities] = useState(checkVoiceCapabilities())
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && step === 'chat' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, step])

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_messages')
    const savedUser = localStorage.getItem('chat_user')
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (e) {
        console.error('Failed to load chat history:', e)
      }
    }
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setUserName(user.name || '')
        setUserEmail(user.email || '')
        if (user.name && user.email) {
          setStep('chat')
        }
      } catch (e) {
        console.error('Failed to load user info:', e)
      }
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  const handleStartChat = () => {
    if (!userName.trim() || !userEmail.trim()) {
      alert('Please enter your name and email to start chatting')
      return
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userEmail)) {
      alert('Please enter a valid email address')
      return
    }

    // Save user info
    localStorage.setItem('chat_user', JSON.stringify({ name: userName, email: userEmail }))
    setStep('chat')
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Hello ${userName}! 👋 Thank you for contacting us. How can we help you today?`,
      sender: 'admin',
      timestamp: new Date().toISOString()
    }
    setMessages([welcomeMessage])
  }

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    Array.from(files).forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'file'
      
      const attachment: Attachment = {
        id: Date.now().toString() + Math.random(),
        type: fileType,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size
      }
      
      setAttachments(prev => [...prev, attachment])
    })
    
    setUploading(false)
    setShowAttachmentPicker(false)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return

    const messageContent = newMessage.trim()
    const currentAttachments = [...attachments]
    
    setNewMessage('')
    setAttachments([])
    setIsSending(true)

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined
    }
    setMessages(prev => [...prev, userMessage])

    try {
      // Prepare attachment data for storage
      const attachmentData = currentAttachments.map(att => ({
        id: att.id,
        type: att.type,
        name: att.name,
        url: att.url,
        size: att.size
      }))

      // Save message to Supabase
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          user_name: userName,
          user_email: userEmail,
          content: messageContent,
          sender: 'user',
          attachments: attachmentData.length > 0 ? JSON.stringify(attachmentData) : null,
          created_at: new Date().toISOString()
        }])

      if (error) {
        console.error('Error saving message:', error)
        // Still show success to user, but log the error
      }

      // Simulate admin response (in production, this would come from real-time updates)
      setTimeout(() => {
        const adminMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Thank you for your message! Our team will review it and get back to you soon. For urgent inquiries, please contact us via email or phone.',
          sender: 'admin',
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, adminMessage])
      }, 1500)

    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Voice call functions
  const startVoiceCall = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      localStreamRef.current = stream
      
      setIsCalling(true)
      
      // Simulate call connection (in production, this would use WebRTC)
      setTimeout(() => {
        setIsCalling(false)
        setIsCallActive(true)
        setCallDuration(0)
        
        // Start call timer
        callTimerRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1)
        }, 1000)
        
        // Add call started message
        const callMessage: Message = {
          id: Date.now().toString(),
          content: '📞 Voice call started',
          sender: 'admin',
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, callMessage])
      }, 2000)
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check your browser permissions.')
      setIsCalling(false)
    }
  }

  const endVoiceCall = () => {
    // Stop media stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    // Clear timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
      callTimerRef.current = null
    }
    
    // Format duration
    const minutes = Math.floor(callDuration / 60)
    const seconds = callDuration % 60
    const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`
    
    // Add call ended message
    const callMessage: Message = {
      id: Date.now().toString(),
      content: callType === 'video' 
        ? `📹 Video call ended (${durationStr})`
        : `📞 Voice call ended (${durationStr})`,
      sender: 'admin',
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, callMessage])
    
    // Reset states
    setIsCallActive(false)
    setIsCalling(false)
    setCallDuration(0)
    setIsMuted(false)
    setCallType('voice')
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = isMuted
        setIsMuted(!isMuted)
      }
    }
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Video call functions
  const startVideoCall = async () => {
    try {
      // Request camera and microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: { width: 640, height: 480 } 
      })
      localStreamRef.current = stream
      
      // Set video source if video element exists
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      setCallType('video')
      setIsCalling(true)
      
      // Simulate call connection
      setTimeout(() => {
        setIsCalling(false)
        setIsCallActive(true)
        setCallDuration(0)
        
        // Start call timer
        callTimerRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1)
        }, 1000)
        
        // Add call started message
        const callMessage: Message = {
          id: Date.now().toString(),
          content: '📹 Video call started',
          sender: 'admin',
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, callMessage])
      }, 2000)
      
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check your browser permissions.')
      setIsCalling(false)
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        // Force re-render
        setIsMuted(isMuted)
      }
    }
  }

  // Translation state management
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationError, setTranslationError] = useState<string | null>(null)
  
  const languages = getSupportedLanguages()

  const handleTranslateMessage = async () => {
    if (!newMessage.trim() || !isTranslationEnabled) return
    
    setIsTranslating(true)
    setTranslationError(null)
    
    try {
      const result = await translateText({
        text: newMessage,
        sourceLang: sourceLanguage,
        targetLang: targetLanguage
      })
      
      setNewMessage(result.translatedText)
      
      // Show success feedback
      console.log(`✓ Translated using ${result.provider}`)
    } catch (error) {
      console.error('Translation error:', error)
      setTranslationError('Translation failed. Please try again.')
      
      // Fallback to mock translation
      const langNames: Record<string, string> = {
        'en': 'English',
        'zh': '中文',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'ja': '日本語',
        'ko': '한국어',
        'ar': 'العربية',
        'ru': 'Русский',
      }
      const langName = langNames[targetLanguage] || targetLanguage
      setNewMessage(`[${langName}] ${newMessage}`)
    } finally {
      setIsTranslating(false)
    }
  }

  // ========== Advanced Voice Translation Functions ==========

  /**
   * Start voice recording with translation
   */
  const startVoiceRecordingWithTranslation = async () => {
    if (!voiceCapabilities.speechRecognition) {
      alert('Speech recognition is not supported in your browser')
      return
    }

    try {
      setIsRecording(true)
      setVoiceTranslationResult(null)
      
      console.log('🎤 Starting voice recording...')
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
        
        // Process the audio
        await processVoiceMessage(audioBlob)
      }
      
      mediaRecorder.start()
      console.log('✓ Recording started')
      
      // Auto-stop after 30 seconds
      recordingTimerRef.current = setTimeout(() => {
        stopVoiceRecording()
      }, 30000)
      
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access microphone. Please check permissions.')
      setIsRecording(false)
    }
  }

  /**
   * Stop voice recording
   */
  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
      
      console.log('✓ Recording stopped')
    }
  }

  /**
   * Process voice message: STT → Translate → TTS
   */
  const processVoiceMessage = async (audioBlob: Blob) => {
    setIsProcessingVoice(true)
    
    try {
      console.log('🔄 Processing voice message...')
      
      const result = await translateVoiceMessage(
        audioBlob,
        sourceLanguage === 'auto' ? 'en-US' : sourceLanguage,
        targetLanguage,
        isAutoPlayEnabled
      )
      
      setVoiceTranslationResult(result)
      
      // Add translated message to chat
      const voiceMessage: Message = {
        id: Date.now().toString(),
        content: `🎤 [Voice] ${result.originalText}\n\n🌐 [Translation] ${result.translatedText}`,
        sender: 'user',
        timestamp: new Date().toISOString(),
        status: 'sent'
      }
      
      setMessages(prev => [...prev, voiceMessage])
      
      // Save to Supabase
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          user_name: userName,
          user_email: userEmail,
          content: voiceMessage.content,
          sender: 'user',
          created_at: new Date().toISOString()
        }])
      
      if (error) {
        console.error('Error saving voice message:', error)
      }
      
      console.log('✓ Voice message processed successfully')
      
    } catch (error) {
      console.error('Voice processing failed:', error)
      alert('Voice processing failed. Please try again or type your message.')
    } finally {
      setIsProcessingVoice(false)
    }
  }

  /**
   * Read message aloud using TTS
   */
  const readMessageAloud = async (text: string, language?: string) => {
    try {
      const lang = language || targetLanguage
      const langCode = lang === 'auto' ? 'en-US' : lang
      
      console.log(`🔊 Reading message in ${langCode}...`)
      await textToSpeech(text, langCode)
      console.log('✓ TTS playback completed')
    } catch (error) {
      console.error('TTS failed:', error)
      alert('Text-to-speech failed. Please try again.')
    }
  }

  /**
   * Start real-time subtitles for video/voice calls
   */
  const startRealtimeSubtitles = () => {
    if (subtitleGenerator) {
      console.log('Subtitles already running')
      return
    }
    
    const generator = new RealTimeSubtitleGenerator(
      sourceLanguage === 'auto' ? 'en-US' : sourceLanguage,
      targetLanguage
    )
    
    generator.start((original, translated) => {
      setRealtimeSubtitles({ original, translated })
    })
    
    setSubtitleGenerator(generator)
    console.log('✓ Real-time subtitles started')
  }

  /**
   * Stop real-time subtitles
   */
  const stopRealtimeSubtitles = () => {
    if (subtitleGenerator) {
      subtitleGenerator.stop()
      setSubtitleGenerator(null)
      setRealtimeSubtitles(null)
      console.log('✓ Real-time subtitles stopped')
    }
  }

  /**
   * Toggle auto-play for translated voice messages
   */
  const toggleAutoPlay = () => {
    setIsAutoPlayEnabled(!isAutoPlayEnabled)
    if (!isAutoPlayEnabled) {
      stopSpeech()
    }
  }

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([])
      setAttachments([])
      setStep('intro')
      setUserName('')
      setUserEmail('')
      localStorage.removeItem('chat_messages')
      localStorage.removeItem('chat_user')
    }
  }

  return (
    <>
      {/* Chat Toggle Button - Responsive positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
        
        {/* Notification badge */}
        {!isOpen && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {messages.length > 9 ? '9+' : messages.length}
          </span>
        )}
      </button>

      {/* Chat Window - Fully responsive */}
      {isOpen && (
        <>
          {/* Mobile overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <div className={`
            fixed z-50 bg-white rounded-t-2xl md:rounded-2xl border border-gray-200
            flex flex-col overflow-hidden
            transition-all duration-300 ease-out
            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}
            
            /* Mobile: Full screen with safe areas */
            inset-x-0 bottom-0 top-auto
            h-[85vh] max-h-[700px]
            pb-safe
            md:h-auto
            
            /* Tablet and Desktop: Fixed size, positioned */
            md:bottom-24 md:right-6
            md:w-[400px] md:max-w-[calc(100vw-3rem)]
            lg:w-[450px]
          `}>
            {/* Header - Responsive design */}
            <div className="bg-gradient-to-r from-charcoal to-gray-800 text-white px-4 py-3 md:px-6 md:py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                    {isCallActive ? (callType === 'video' ? <VideoIcon className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />) : <MessageCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg">
                      {isCallActive ? (callType === 'video' ? 'Video Call' : 'Voice Call') : 'Live Chat'}
                    </h3>
                    <p className="text-xs text-white/70 hidden sm:block">
                      {isCallActive ? formatCallDuration(callDuration) : 'We typically reply within minutes'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {step === 'chat' && !isCallActive && (
                    <>
                      <button
                        onClick={startVoiceCall}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Start voice call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={startVideoCall}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Start video call"
                      >
                        <VideoIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={clearChat}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Clear chat"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors md:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Online status indicator */}
              <div className="flex items-center mt-2 space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs text-white/80">Online now</span>
              </div>
            </div>

            {/* Voice/Video Call Overlay */}
            {(isCalling || isCallActive) && (
              <div className="absolute inset-0 z-50 bg-gradient-to-b from-charcoal to-gray-900 flex flex-col items-center justify-center p-6">
                <div className="text-center space-y-6 w-full">
                  {/* Video preview for video calls */}
                  {callType === 'video' && (
                    <div className="relative w-full max-w-sm mx-auto aspect-video bg-gray-800 rounded-xl overflow-hidden">
                      <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline 
                        muted
                        className="w-full h-full object-cover"
                      />
                      {!localStreamRef.current?.getVideoTracks()[0]?.enabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                          <CameraOff className="w-12 h-12 text-gray-500" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Avatar for voice calls */}
                  {callType === 'voice' && (
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center animate-pulse">
                      <PhoneCall className="w-12 h-12 text-white" />
                    </div>
                  )}
                  
                  {/* Status */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {isCalling ? 'Connecting...' : (callType === 'video' ? 'On Video Call' : 'On Voice Call')}
                    </h3>
                    <p className="text-white/70">
                      {isCalling ? 'Please wait...' : formatCallDuration(callDuration)}
                    </p>
                  </div>
                  
                  {/* Real-time Subtitles Display */}
                  {realtimeSubtitles && (
                    <div className="w-full max-w-2xl mx-auto space-y-2">
                      {/* Original text */}
                      <div className="bg-gray-800/80 backdrop-blur rounded-lg p-3 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-300">{realtimeSubtitles.original}</p>
                      </div>
                      {/* Translated text */}
                      <div className="bg-amber-600/20 backdrop-blur rounded-lg p-3 border-l-4 border-amber-500">
                        <p className="text-sm text-white font-medium">{realtimeSubtitles.translated}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Call controls */}
                  <div className="flex items-center justify-center space-x-4 pt-4">
                    {isCallActive && (
                      <>
                        <button
                          onClick={toggleMute}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                            isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          title={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                        {callType === 'video' && (
                          <button
                            onClick={toggleVideo}
                            className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                            title="Toggle camera"
                          >
                            {localStreamRef.current?.getVideoTracks()[0]?.enabled ? (
                              <Camera className="w-6 h-6" />
                            ) : (
                              <CameraOff className="w-6 h-6" />
                            )}
                          </button>
                        )}
                        {/* Real-time subtitles toggle */}
                        <button
                          onClick={subtitleGenerator ? stopRealtimeSubtitles : startRealtimeSubtitles}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                            subtitleGenerator ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          title={subtitleGenerator ? 'Stop subtitles' : 'Start real-time subtitles'}
                        >
                          <Subtitles className="w-6 h-6" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={endVoiceCall}
                      className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                      title="End call"
                    >
                      <PhoneOff className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {step === 'intro' ? (
                /* Intro Screen - Responsive */
                <div className="p-4 md:p-6 space-y-6">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto">
                      <MessageCircle className="w-8 h-8 text-amber-700" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900">Welcome!</h4>
                    <p className="text-sm text-gray-600">
                      We're here to help. Please enter your details to start chatting.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-1" />
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && inputRef.current?.focus()}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                      />
                    </div>

                    <Button
                      variant="accent"
                      className="w-full py-3 text-base"
                      onClick={handleStartChat}
                    >
                      Start Chat
                    </Button>
                  </div>

                  {/* Contact alternatives */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center mb-3">Or contact us via:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href="mailto:support@fixr2026.com"
                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </a>
                      <a
                        href="tel:+861234567890"
                        className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Phone</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Messages - Responsive */
                <div className="p-4 md:p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs mt-1">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] md:max-w-[75%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-br-md'
                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            {/* Message text */}
                            {message.content && (
                              <div className="relative group">
                                <p className="text-sm whitespace-pre-wrap break-words pr-8">{message.content}</p>
                                
                                {/* Read aloud button - appears on hover */}
                                {isTranslationEnabled && (
                                  <button
                                    onClick={() => readMessageAloud(message.content, targetLanguage)}
                                    className="absolute top-0 right-0 p-1.5 bg-white/20 hover:bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Read message aloud"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}
                            
                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id} className="rounded-lg overflow-hidden">
                                    {attachment.type === 'image' ? (
                                      <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="block">
                                        <img 
                                          src={attachment.url} 
                                          alt={attachment.name} 
                                          className="max-w-full h-auto rounded-lg max-h-48 object-cover"
                                        />
                                        <div className="mt-1 text-xs opacity-75 truncate">{attachment.name}</div>
                                      </a>
                                    ) : attachment.type === 'video' ? (
                                      <div className="relative">
                                        <video 
                                          src={attachment.url} 
                                          controls 
                                          className="max-w-full h-auto rounded-lg max-h-48"
                                        />
                                        <div className="mt-1 text-xs opacity-75 truncate">{attachment.name}</div>
                                      </div>
                                    ) : (
                                      <a 
                                        href={attachment.url} 
                                        download={attachment.name}
                                        className="flex items-center space-x-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                      >
                                        <FileText className="w-4 h-4 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-medium truncate">{attachment.name}</div>
                                          <div className="text-xs opacity-75">{formatFileSize(attachment.size)}</div>
                                        </div>
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className={`flex items-center mt-1 space-x-2 ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                            {message.sender === 'user' && message.status && (
                              <span className="text-xs text-amber-600">
                                {message.status === 'sent' && '✓'}
                                {message.status === 'delivered' && '✓✓'}
                                {message.status === 'read' && '✓✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Attachment Preview */}
            {attachments.length > 0 && (
              <div className="border-t border-gray-200 p-3 bg-gray-50 max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="relative group">
                      {attachment.type === 'image' ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                          <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : attachment.type === 'video' ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                          <Video className="w-6 h-6 text-gray-400" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <CloseIcon className="w-3 h-3" />
                      </button>
                      <div className="mt-1 text-xs text-gray-600 truncate max-w-[64px]">{attachment.name}</div>
                      <div className="text-xs text-gray-400">{formatFileSize(attachment.size)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area - Only shown in chat mode */}
            {step === 'chat' && (
              <div className="border-t border-gray-200 p-3 md:p-4 bg-white flex-shrink-0 safe-area-bottom">
                {/* Attachment picker popup */}
                {showAttachmentPicker && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Attach file</span>
                      <button
                        onClick={() => setShowAttachmentPicker(false)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <CloseIcon className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          if (fileInputRef.current) fileInputRef.current.accept = "image/*";
                          fileInputRef.current?.click();
                        }}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ImageIcon className="w-6 h-6 text-amber-600 mb-1" />
                        <span className="text-xs text-gray-600">Image</span>
                      </button>
                      <button
                        onClick={() => {
                          if (fileInputRef.current) fileInputRef.current.accept = "video/*";
                          fileInputRef.current?.click();
                        }}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Video className="w-6 h-6 text-blue-600 mb-1" />
                        <span className="text-xs text-gray-600">Video</span>
                      </button>
                      <button
                        onClick={() => {
                          if (fileInputRef.current) fileInputRef.current.accept = "image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv";
                          fileInputRef.current?.click();
                        }}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="w-6 h-6 text-gray-600 mb-1" />
                        <span className="text-xs text-gray-600">File</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Language picker popup */}
                {showLanguagePicker && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        Translation Settings
                      </span>
                      <button
                        onClick={() => setShowLanguagePicker(false)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <CloseIcon className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    
                    {/* Toggle translation */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Enable Translation</span>
                      <button
                        onClick={() => setIsTranslationEnabled(!isTranslationEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isTranslationEnabled ? 'bg-amber-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isTranslationEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {/* Target language selection */}
                    {isTranslationEnabled && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Translate to:</label>
                        <select
                          value={targetLanguage}
                          onChange={(e) => setTargetLanguage(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          {languages.filter(lang => lang.code !== 'auto').map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.name}
                            </option>
                          ))}
                        </select>
                        
                        {/* Auto-play TTS toggle */}
                        <div className="mt-3 flex items-center justify-between pb-3 border-b border-gray-200">
                          <span className="text-xs text-gray-600 flex items-center">
                            <Volume2 className="w-3 h-3 mr-1" />
                            Auto-play translated audio
                          </span>
                          <button
                            onClick={toggleAutoPlay}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              isAutoPlayEnabled ? 'bg-amber-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                isAutoPlayEnabled ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        {/* Voice capabilities status */}
                        <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
                          <p className="font-medium mb-1">🎤 Voice Features Available</p>
                          <ul className="text-[10px] space-y-0.5 opacity-80">
                            <li>✓ Speech Recognition (STT)</li>
                            <li>✓ Text-to-Speech (TTS)</li>
                            <li>✓ Real-time Translation</li>
                            <li>✓ Video Call Subtitles</li>
                          </ul>
                        </div>
                        
                        {/* Translation provider info */}
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                          <p className="font-medium mb-1">✓ Real-time Translation Active</p>
                          <p className="text-[10px] opacity-80">
                            Using MyMemory API (free, 1000 words/day) with LibreTranslate fallback
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Error message */}
                    {translationError && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                        <p className="font-medium">⚠ Translation Error</p>
                        <p className="text-[10px]">{translationError}</p>
                        <button 
                          onClick={() => setTranslationError(null)}
                          className="mt-1 text-red-600 underline hover:text-red-800"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Voice Translation Result Display */}
                {voiceTranslationResult && (
                  <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-green-700 flex items-center">
                        🎤 Voice Translation Result
                      </span>
                      <button
                        onClick={() => setVoiceTranslationResult(null)}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                      >
                        <CloseIcon className="w-3 h-3 text-green-600" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Original:</span> {voiceTranslationResult.originalText}
                      </div>
                      <div className="text-xs text-green-700">
                        <span className="font-medium">Translated:</span> {voiceTranslationResult.translatedText}
                      </div>
                      {voiceTranslationResult.audioPlayed && (
                        <div className="text-[10px] text-green-600 flex items-center">
                          <Volume2 className="w-3 h-3 mr-1" />
                          Audio played automatically
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="flex items-end space-x-2 md:space-x-3">
                  {/* Attachment button */}
                  <button
                    onClick={() => setShowAttachmentPicker(!showAttachmentPicker)}
                    className="flex-shrink-0 p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  {/* Voice recording with translation button */}
                  {voiceCapabilities.speechRecognition && (
                    <button
                      onMouseDown={startVoiceRecordingWithTranslation}
                      onMouseUp={stopVoiceRecording}
                      onTouchStart={startVoiceRecordingWithTranslation}
                      onTouchEnd={stopVoiceRecording}
                      disabled={isProcessingVoice}
                      className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                        isRecording 
                          ? 'bg-red-500 text-white animate-pulse scale-110' 
                          : isProcessingVoice
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title={isRecording ? 'Release to stop recording' : 'Hold to record voice (with auto-translation)'}
                    >
                      {isProcessingVoice ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </button>
                  )}

                  {/* Translation button */}
                  <button
                    onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                    className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                      isTranslationEnabled 
                        ? 'text-amber-600 bg-amber-50' 
                        : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    title="Translation settings"
                  >
                    <Languages className="w-5 h-5" />
                  </button>

                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-3 py-2 md:px-4 md:py-3 pr-10 md:pr-12 border border-gray-300 rounded-xl md:rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm md:text-base leading-relaxed"
                      style={{ 
                        minHeight: '44px',
                        maxHeight: '120px',
                        overflowY: 'auto'
                      }}
                      disabled={isSending || uploading}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                      }}
                    />
                    <div className="absolute right-2 bottom-2 md:right-3 md:bottom-3 text-xs text-gray-400 pointer-events-none">
                      {newMessage.length > 0 && `${newMessage.length}/500`}
                    </div>
                    {/* Translation indicator */}
                    {isTranslationEnabled && newMessage.length > 0 && (
                      <div className="absolute left-2 top-2 text-xs text-amber-600 flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        <span className="text-[10px]">{targetLanguage.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Translate button - shown when translation is enabled and there's text */}
                  {isTranslationEnabled && newMessage.trim().length > 0 && (
                    <button
                      onClick={handleTranslateMessage}
                      disabled={isTranslating}
                      className={`flex-shrink-0 px-3 py-2 text-xs rounded-lg transition-colors flex items-center space-x-1 ${
                        isTranslating 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : translationError
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                      title={translationError || 'Translate message'}
                    >
                      {isTranslating ? (
                        <>
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>...</span>
                        </>
                      ) : (
                        <>
                          <Languages className="w-3 h-3" />
                          <span>Translate</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  <Button
                    variant="accent"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isSending || uploading || (!newMessage.trim() && attachments.length === 0)}
                    className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full"
                  >
                    {isSending || uploading ? (
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </Button>
                </div>
                
                {/* Quick tips - hidden on small screens to save space */}
                <div className="mt-1.5 md:mt-2 flex items-center justify-between text-xs text-gray-400 hidden md:flex">
                  <span>Press Enter to send</span>
                  <span>Shift+Enter for new line</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ChatWidget
