const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// 配置存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isImage = file.mimetype.startsWith('image/');
        const uploadDir = isImage ? 'uploads/images' : 'uploads/documents';
        
        // 确保目录存在
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        // 图片
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml',
        // 文档
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv',
        // 音视频
        'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
        'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/mp4'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('不支持的文件类型: ' + file.mimetype), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB 限制
    }
});

// 上传文件路由
router.post('/file', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '没有上传文件' });
        }
        
        const fileUrl = `/uploads/${req.file.path.replace('uploads/', '')}`;
        
        // 处理文件名编码问题（防止中文乱码）
        let originalName = req.file.originalname;
        
        // 使用更安全的解码方式
        try {
            // 检查是否已经是 UTF-8 编码
            if (/^[\x00-\x7F]*$/.test(originalName)) {
                // 纯 ASCII，不需要解码
                originalName = originalName;
            } else {
                // 包含非 ASCII 字符，尝试解码
                originalName = decodeURIComponent(escape(originalName));
            }
        } catch (e) {
            // 如果解码失败，使用原始文件名
            console.warn('Filename decode failed, using original:', originalName);
            originalName = req.file.originalname;
        }
        
        res.json({
            success: true,
            fileUrl: fileUrl,
            fileName: originalName,
            fileType: req.file.mimetype,
            fileSize: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: '文件上传失败: ' + error.message });
    }
});

// 错误处理中间件
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: '文件上传错误: ' + err.message });
    }
    res.status(500).json({ error: '服务器错误' });
});

module.exports = router;
