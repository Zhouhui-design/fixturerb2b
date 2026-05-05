/**
 * Translation Service
 * Supports multiple translation providers with fallback mechanism
 * Includes STT (Speech-to-Text) and TTS (Text-to-Speech)
 */

export interface TranslationOptions {
  text: string
  sourceLang?: string
  targetLang: string
}

export interface TranslationResult {
  translatedText: string
  detectedLanguage?: string
  provider: 'mymemory' | 'libretranslate' | 'mock'
}

export interface SpeechRecognitionResult {
  text: string
  confidence: number
  language: string
}

export interface TextToSpeechResult {
  audioBlob: Blob
  format: 'mp3' | 'wav'
}

/**
 * Language code mapping for different services
 */
const LANGUAGE_MAP: Record<string, string> = {
  'auto': 'auto',
  'en': 'en',
  'zh': 'zh-CN',
  'es': 'es',
  'fr': 'fr',
  'de': 'de',
  'ja': 'ja',
  'ko': 'ko',
  'ar': 'ar',
  'ru': 'ru',
  'pt': 'pt',
  'it': 'it',
  'nl': 'nl',
  'pl': 'pl',
  'tr': 'tr',
  'vi': 'vi',
  'th': 'th',
  'id': 'id',
  'hi': 'hi',
}

/**
 * Translate text using MyMemory API (free, no API key required)
 * Rate limit: 1000 words/day for anonymous users
 */
async function translateWithMyMemory(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult> {
  try {
    const mappedSourceLang = LANGUAGE_MAP[sourceLang] || 'auto'
    const mappedTargetLang = LANGUAGE_MAP[targetLang] || 'en'
    
    // MyMemory API endpoint
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${mappedSourceLang}|${mappedTargetLang}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.responseStatus === 200) {
      return {
        translatedText: data.responseData.translatedText,
        detectedLanguage: data.responseData.detectedLanguage,
        provider: 'mymemory'
      }
    } else {
      throw new Error(data.responseDetails || 'Translation failed')
    }
  } catch (error) {
    console.warn('MyMemory translation failed:', error)
    throw error
  }
}

/**
 * Translate text using LibreTranslate API (self-hosted or public instances)
 * Free and open-source alternative
 */
async function translateWithLibreTranslate(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult> {
  try {
    const mappedSourceLang = sourceLang === 'auto' ? 'auto' : (LANGUAGE_MAP[sourceLang] || 'en')
    const mappedTargetLang = LANGUAGE_MAP[targetLang] || 'en'
    
    // Using a public LibreTranslate instance (you can self-host for production)
    const url = 'https://libretranslate.de/translate'
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: mappedSourceLang,
        target: mappedTargetLang,
        format: 'text'
      })
    })
    
    if (!response.ok) {
      throw new Error(`LibreTranslate API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      translatedText: data.translatedText,
      provider: 'libretranslate'
    }
  } catch (error) {
    console.warn('LibreTranslate translation failed:', error)
    throw error
  }
}

/**
 * Mock translation for testing/fallback
 */
function mockTranslate(
  text: string,
  targetLang: string
): TranslationResult {
  // Simulate translation delay
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
    'pt': 'Português',
  }
  
  const langName = langNames[targetLang] || targetLang
  return {
    translatedText: `[${langName}] ${text}`,
    provider: 'mock'
  }
}

/**
 * Main translation function with automatic fallback
 * Tries multiple providers in order of preference
 */
export async function translateText(
  options: TranslationOptions
): Promise<TranslationResult> {
  const { text, sourceLang = 'auto', targetLang } = options
  
  if (!text || !text.trim()) {
    return {
      translatedText: '',
      provider: 'mock'
    }
  }
  
  // Try providers in order
  const providers = [
    {
      name: 'MyMemory',
      fn: () => translateWithMyMemory(text, sourceLang, targetLang)
    },
    {
      name: 'LibreTranslate',
      fn: () => translateWithLibreTranslate(text, sourceLang, targetLang)
    }
  ]
  
  for (const provider of providers) {
    try {
      console.log(`Attempting translation with ${provider.name}...`)
      const result = await provider.fn()
      console.log(`✓ Translation successful with ${provider.name}`)
      return result
    } catch (error) {
      console.warn(`${provider.name} translation failed, trying next provider...`, error)
      continue
    }
  }
  
  // All providers failed, use mock translation as last resort
  console.warn('All translation providers failed, using mock translation')
  return mockTranslate(text, targetLang)
}

/**
 * Batch translate multiple texts
 */
export async function batchTranslate(
  texts: string[],
  targetLang: string,
  sourceLang: string = 'auto'
): Promise<TranslationResult[]> {
  const results: TranslationResult[] = []
  
  for (const text of texts) {
    try {
      const result = await translateText({ text, sourceLang, targetLang })
      results.push(result)
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Failed to translate text: "${text.substring(0, 50)}..."`, error)
      results.push(mockTranslate(text, targetLang))
    }
  }
  
  return results
}

/**
 * Detect language of text
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 100))}&langpair=auto|en`
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.responseStatus === 200 && data.responseData.detectedLanguage) {
      return data.responseData.detectedLanguage
    }
  } catch (error) {
    console.warn('Language detection failed:', error)
  }
  
  return 'unknown'
}

/**
 * Get supported languages list
 */
export function getSupportedLanguages() {
  return [
    { code: 'auto', name: 'Auto Detect' },
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'ko', name: '한국어 (Korean)' },
    { code: 'ar', name: 'العربية (Arabic)' },
    { code: 'ru', name: 'Русский (Russian)' },
    { code: 'pt', name: 'Português (Portuguese)' },
    { code: 'it', name: 'Italiano (Italian)' },
    { code: 'nl', name: 'Nederlands (Dutch)' },
    { code: 'pl', name: 'Polski (Polish)' },
    { code: 'tr', name: 'Türkçe (Turkish)' },
    { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
    { code: 'th', name: 'ไทย (Thai)' },
    { code: 'id', name: 'Bahasa Indonesia (Indonesian)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
  ]
}

/**
 * Speech-to-Text using Web Speech API (browser built-in)
 * Free and works offline in modern browsers
 */
export async function speechToText(
  audioBlob: Blob,
  language: string = 'en-US'
): Promise<SpeechRecognitionResult> {
  return new Promise((resolve, reject) => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      reject(new Error('Speech Recognition not supported in this browser'))
      return
    }
    
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = language
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      const confidence = event.results[0][0].confidence
      
      resolve({
        text: transcript,
        confidence: confidence,
        language: language
      })
    }
    
    recognition.onerror = (event: any) => {
      reject(new Error(`Speech recognition error: ${event.error}`))
    }
    
    recognition.start()
    
    // Timeout after 30 seconds
    setTimeout(() => {
      recognition.stop()
      reject(new Error('Speech recognition timeout'))
    }, 30000)
  })
}

/**
 * Text-to-Speech using Web Speech API (browser built-in)
 * Free and works offline
 */
export async function textToSpeech(
  text: string,
  language: string = 'en-US',
  rate: number = 1.0,
  pitch: number = 1.0
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if browser supports Speech Synthesis
    if (!window.speechSynthesis) {
      reject(new Error('Speech Synthesis not supported in this browser'))
      return
    }
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    utterance.rate = rate
    utterance.pitch = pitch
    
    // Try to find a voice for the language
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(v => v.lang.startsWith(language.split('-')[0]))
    if (voice) {
      utterance.voice = voice
    }
    
    utterance.onend = () => resolve()
    utterance.onerror = (event) => reject(new Error(`TTS error: ${event.error}`))
    
    window.speechSynthesis.speak(utterance)
  })
}

/**
 * Stop any ongoing speech synthesis
 */
export function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

/**
 * Complete voice translation pipeline:
 * Audio → STT → Translation → TTS
 */
export interface VoiceTranslationResult {
  originalText: string
  translatedText: string
  detectedLanguage?: string
  audioPlayed: boolean
}

export async function translateVoiceMessage(
  audioBlob: Blob,
  sourceLang: string,
  targetLang: string,
  autoPlayAudio: boolean = true
): Promise<VoiceTranslationResult> {
  try {
    console.log('🎤 Starting voice translation pipeline...')
    
    // Step 1: Speech to Text
    console.log('Step 1: Converting speech to text...')
    const sttResult = await speechToText(audioBlob, sourceLang)
    console.log(`✓ STT result: "${sttResult.text}"`)
    
    // Step 2: Translate text
    console.log('Step 2: Translating text...')
    const translationResult = await translateText({
      text: sttResult.text,
      sourceLang: sttResult.language,
      targetLang: targetLang
    })
    console.log(`✓ Translation result: "${translationResult.translatedText}"`)
    
    // Step 3: Text to Speech (optional)
    let audioPlayed = false
    if (autoPlayAudio) {
      console.log('Step 3: Converting translated text to speech...')
      try {
        await textToSpeech(translationResult.translatedText, targetLang)
        audioPlayed = true
        console.log('✓ TTS playback completed')
      } catch (ttsError) {
        console.warn('TTS failed:', ttsError)
      }
    }
    
    return {
      originalText: sttResult.text,
      translatedText: translationResult.translatedText,
      detectedLanguage: translationResult.detectedLanguage,
      audioPlayed
    }
  } catch (error) {
    console.error('Voice translation pipeline failed:', error)
    throw error
  }
}

/**
 * Real-time subtitle generator for video calls
 * Continuously transcribes and translates speech
 */
export class RealTimeSubtitleGenerator {
  private recognition: any
  private isRunning: boolean = false
  private onSubtitleUpdate?: (original: string, translated: string) => void
  
  constructor(
    private sourceLang: string = 'en-US',
    private targetLang: string = 'zh-CN'
  ) {}
  
  /**
   * Start real-time subtitle generation
   */
  start(onUpdate: (original: string, translated: string) => void) {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition not supported')
    }
    
    this.onSubtitleUpdate = onUpdate
    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = this.sourceLang
    
    this.recognition.onresult = async (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }
      
      // Show interim results immediately
      if (interimTranscript && this.onSubtitleUpdate) {
        this.onSubtitleUpdate(interimTranscript, '...')
      }
      
      // Translate and show final results
      if (finalTranscript && this.onSubtitleUpdate) {
        try {
          const translation = await translateText({
            text: finalTranscript,
            sourceLang: this.sourceLang,
            targetLang: this.targetLang
          })
          this.onSubtitleUpdate(finalTranscript, translation.translatedText)
        } catch (error) {
          console.error('Real-time translation failed:', error)
          this.onSubtitleUpdate(finalTranscript, '[Translation failed]')
        }
      }
    }
    
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
    }
    
    this.recognition.start()
    this.isRunning = true
    console.log('✓ Real-time subtitle generator started')
  }
  
  /**
   * Stop subtitle generation
   */
  stop() {
    if (this.recognition && this.isRunning) {
      this.recognition.stop()
      this.isRunning = false
      console.log('✓ Real-time subtitle generator stopped')
    }
  }
  
  /**
   * Change target language
   */
  setTargetLanguage(lang: string) {
    this.targetLang = lang
  }
}

/**
 * Get available voices for TTS
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!window.speechSynthesis) {
    return []
  }
  return window.speechSynthesis.getVoices()
}

/**
 * Check browser capabilities for voice features
 */
export function checkVoiceCapabilities() {
  return {
    speechRecognition: !!(
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    ),
    speechSynthesis: !!window.speechSynthesis,
    mediaRecorder: !!window.MediaRecorder,
    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }
}
