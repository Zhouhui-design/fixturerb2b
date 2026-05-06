const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

/**
 * 生成阿里云签名
 */
function generateSignature(appKey, token, timestamp) {
    const stringToSign = `${appKey}\n${timestamp}`;
    const signature = crypto
        .createHmac('sha256', token)
        .update(stringToSign)
        .digest('base64');
    return signature;
}

/**
 * 语音转文字 API（使用阿里云智能语音交互 - 录音文件识别）
 * POST /api/voice/transcribe-aliyun
 * 
 * 请求参数:
 * - audio: 音频文件 (multipart/form-data)
 * - language: 目标语言 (可选，默认 zh-cn)
 * 
 * 响应:
 * {
 *   success: true,
 *   text: "识别的文字",
 *   confidence: 置信度
 * }
 */
router.post('/transcribe-aliyun', upload.single('audio'), async (req, res) => {
    try {
        // 检查配置
        const appKey = process.env.ALIYUN_ASR_APPKEY;
        const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID;
        const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET;
        
        if (!appKey || !accessKeyId || !accessKeySecret) {
            return res.status(503).json({
                success: false,
                error: '阿里云语音服务未配置，请联系管理员'
            });
        }

        // 检查文件是否存在
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: '没有上传音频文件'
            });
        }

        console.log(`[Aliyun ASR] Processing file: ${req.file.filename}, size: ${req.file.size} bytes`);

        const language = req.body.language || 'zh-cn';

        // 第一步：获取 Token
        const tokenUrl = 'https://nls-meta.cn-shanghai.aliyuncs.com/';
        const tokenParams = new URLSearchParams({
            Action: 'CreateToken',
            Version: '2019-02-28',
            Format: 'JSON',
            RegionId: 'cn-shanghai',
            AccessKeyId: accessKeyId,
            SignatureMethod: 'HMAC-SHA1',
            Timestamp: new Date().toISOString(),
            SignatureVersion: '1.0',
            SignatureNonce: Date.now().toString()
        });

        // 生成签名
        const stringToSign = `POST&%2F&${encodeURIComponent(tokenParams.toString())}`;
        const signature = crypto
            .createHmac('sha1', accessKeySecret + '&')
            .update(stringToSign)
            .digest('base64');

        tokenParams.append('Signature', signature);

        // 获取 Token
        const tokenResponse = await fetch(`${tokenUrl}?${tokenParams.toString()}`, {
            method: 'POST'
        });

        const tokenData = await tokenResponse.json();
        
        if (!tokenData.Token || !tokenData.Token.Id) {
            throw new Error('获取 Token 失败: ' + JSON.stringify(tokenData));
        }

        const token = tokenData.Token.Id;
        console.log(`[Aliyun ASR] Token obtained successfully`);

        // 第二步：上传音频文件到 OSS 或直接调用识别 API
        // 这里使用简化的方式：直接将音频文件转为 base64 后调用 REST API
        const audioBuffer = fs.readFileSync(req.file.path);
        const audioBase64 = audioBuffer.toString('base64');

        // 调用阿里云录音文件识别 REST API
        const asrUrl = 'https://nls-gateway.cn-shanghai.aliyuncs.com/stream/v1/asr';
        
        const asrResponse = await fetch(asrUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-NLS-Token': token
            },
            body: JSON.stringify({
                appkey: appKey,
                format: 'wav',
                sample_rate: 16000,
                enable_words: false,
                audio: audioBase64
            })
        });

        const result = await asrResponse.json();

        // 删除临时文件
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('[Aliyun ASR] Failed to delete temp file:', err);
            }
        });

        if (result.status === 20000000 && result.result) {
            console.log(`[Aliyun ASR] Transcription successful: ${result.result.substring(0, 50)}...`);
            
            res.json({
                success: true,
                text: result.result,
                confidence: result.confidence || 1.0
            });
        } else {
            throw new Error(result.message || '识别失败');
        }

    } catch (error) {
        console.error('[Aliyun ASR] Transcription error:', error);

        // 删除临时文件（如果存在）
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, () => {});
        }

        let errorMessage = '语音转文字失败';
        
        if (error.message.includes('InvalidAccessKeyId')) {
            errorMessage = 'AccessKey ID 无效，请检查配置';
        } else if (error.message.includes('AppKey')) {
            errorMessage = 'AppKey 无效，请检查配置';
        } else if (error.message.includes('quota')) {
            errorMessage = '免费额度已用完';
        } else if (error.message.includes('Token')) {
            errorMessage = 'Token 获取失败，请检查 AccessKey';
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
 * POST /api/voice/transcribe-and-translate-aliyun
 */
router.post('/transcribe-and-translate-aliyun', upload.single('audio'), async (req, res) => {
    try {
        const appKey = process.env.ALIYUN_ASR_APPKEY;
        const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID;
        const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET;
        
        if (!appKey || !accessKeyId || !accessKeySecret) {
            return res.status(503).json({
                success: false,
                error: '阿里云语音服务未配置'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: '没有上传音频文件'
            });
        }

        const targetLang = req.body.targetLang || 'zh';

        console.log(`[Aliyun ASR] Transcribing and translating to ${targetLang}`);

        // 第一步：转录音频
        const audioBuffer = fs.readFileSync(req.file.path);
        
        const asrUrl = `https://nls-gateway.cn-shanghai.aliyuncs.com/stream/v1/asr`;
        const formData = new FormData();
        formData.append('appkey', appKey);
        formData.append('format', 'wav');
        formData.append('sample_rate', '16000');
        formData.append('audio', audioBuffer);

        const asrResponse = await fetch(asrUrl, {
            method: 'POST',
            headers: {
                'X-NLS-Token': accessKeySecret
            },
            body: formData
        });

        const asrResult = await asrResponse.json();

        if (asrResult.status !== 20000000 || !asrResult.result) {
            throw new Error(asrResult.message || '识别失败');
        }

        const originalText = asrResult.result;
        console.log(`[Aliyun ASR] Transcription: ${originalText.substring(0, 50)}...`);

        // 第二步：翻译文本（使用 MyMemory 免费 API）
        let translated = originalText;
        try {
            const translateResponse = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}&langpair=auto|${targetLang}`
            );
            const translateData = await translateResponse.json();
            
            if (translateData.responseStatus === 200) {
                translated = translateData.responseData.translatedText;
                console.log(`[Aliyun ASR] Translation: ${translated.substring(0, 50)}...`);
            }
        } catch (translateError) {
            console.warn('[Aliyun ASR] Translation failed, using original text:', translateError.message);
        }

        // 删除临时文件
        fs.unlink(req.file.path, () => {});

        res.json({
            success: true,
            original: originalText,
            translated: translated,
            targetLang: targetLang
        });

    } catch (error) {
        console.error('[Aliyun ASR] Transcribe and translate error:', error);

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
