const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const router = express.Router();

// 配置 multer 用于临时文件存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/temp');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `voice-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB 限制
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/mp4', 'audio/ogg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('不支持的音频格式'), false);
        }
    }
});

// 初始化 OpenAI 客户端
let openai;
try {
    if (process.env.OPENAI_API_KEY) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        console.log('[Whisper] OpenAI client initialized');
    } else {
        console.warn('[Whisper] OPENAI_API_KEY not configured');
    }
} catch (err) {
    console.error('[Whisper] Failed to initialize OpenAI client:', err.message);
}

/**
 * 语音转文字 API
 * POST /api/voice/transcribe
 * 
 * 请求参数:
 * - audio: 音频文件 (multipart/form-data)
 * - language: 目标语言 (可选，默认 auto)
 * 
 * 响应:
 * {
 *   success: true,
 *   text: "识别的文字",
 *   language: "检测到的语言",
 *   duration: 音频时长(秒)
 * }
 */
router.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        // 检查 OpenAI 是否配置
        if (!openai) {
            return res.status(503).json({
                success: false,
                error: '语音转文字服务未配置，请联系管理员'
            });
        }

        // 检查文件是否存在
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: '没有上传音频文件'
            });
        }

        console.log(`[Whisper] Processing file: ${req.file.filename}, size: ${req.file.size} bytes`);

        const targetLanguage = req.body.language || 'zh';

        // 调用 Whisper API
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: 'whisper-1',
            language: targetLanguage === 'auto' ? undefined : targetLanguage,
            response_format: 'verbose_json' // 获取详细信息
        });

        // 删除临时文件
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('[Whisper] Failed to delete temp file:', err);
            }
        });

        console.log(`[Whisper] Transcription successful: ${transcription.text.substring(0, 50)}...`);

        res.json({
            success: true,
            text: transcription.text,
            language: transcription.language || 'unknown',
            duration: transcription.duration || 0,
            segments: transcription.segments?.length || 0
        });

    } catch (error) {
        console.error('[Whisper] Transcription error:', error);

        // 删除临时文件（如果存在）
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, () => {});
        }

        // 错误处理
        let errorMessage = '语音转文字失败';
        
        if (error.code === 'authentication_error') {
            errorMessage = 'API Key 无效，请检查配置';
        } else if (error.code === 'insufficient_quota') {
            errorMessage = 'API 额度已用完，请充值';
        } else if (error.message.includes('File too large')) {
            errorMessage = '音频文件过大，最大支持 25MB';
        } else if (error.message.includes('Unsupported file type')) {
            errorMessage = '不支持的音频格式';
        } else {
            errorMessage = error.message || '未知错误';
        }

        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});

/**
 * 语音转文字并翻译
 * POST /api/voice/transcribe-and-translate
 * 
 * 请求参数:
 * - audio: 音频文件
 * - targetLang: 目标翻译语言 (例如: zh, en, ja)
 * 
 * 响应:
 * {
 *   success: true,
 *   original: "原始识别文字",
 *   translated: "翻译后的文字",
 *   language: "检测到的语言"
 * }
 */
router.post('/transcribe-and-translate', upload.single('audio'), async (req, res) => {
    try {
        if (!openai) {
            return res.status(503).json({
                success: false,
                error: '语音转文字服务未配置'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: '没有上传音频文件'
            });
        }

        const targetLang = req.body.targetLang || 'zh';

        console.log(`[Whisper] Transcribing and translating to ${targetLang}`);

        // 第一步：转录音频
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: 'whisper-1',
            response_format: 'text'
        });

        console.log(`[Whisper] Transcription: ${transcription.substring(0, 50)}...`);

        // 第二步：翻译文本（使用 MyMemory 免费 API）
        let translated = transcription;
        try {
            const translateResponse = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(transcription)}&langpair=auto|${targetLang}`
            );
            const translateData = await translateResponse.json();
            
            if (translateData.responseStatus === 200) {
                translated = translateData.responseData.translatedText;
                console.log(`[Whisper] Translation: ${translated.substring(0, 50)}...`);
            }
        } catch (translateError) {
            console.warn('[Whisper] Translation failed, using original text:', translateError.message);
            // 翻译失败时返回原文
        }

        // 删除临时文件
        fs.unlink(req.file.path, () => {});

        res.json({
            success: true,
            original: transcription,
            translated: translated,
            targetLang: targetLang
        });

    } catch (error) {
        console.error('[Whisper] Transcribe and translate error:', error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, () => {});
        }

        res.status(500).json({
            success: false,
            error: error.message || '处理失败'
        });
    }
});

module.exports = router;
