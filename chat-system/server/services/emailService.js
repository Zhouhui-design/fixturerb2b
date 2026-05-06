const API_KEY = process.env.RESEND_API_KEY || 're_your_api_key_here';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@fixturerb2b.top';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

class EmailService {
    constructor() {
        console.log('Email service initialized with HTTP API');
        console.log('Admin email:', ADMIN_EMAIL);
    }

    /**
     * 发送新消息通知给管理员
     */
    async sendNewMessageNotification(customerName, messageContent, tenantId = 'fixturerb2b') {
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: `Fixturerb2b <${FROM_EMAIL}>`,
                    to: [ADMIN_EMAIL],
                    subject: `🔔 新消息来自 ${customerName}`,
                    html: this.generateNewMessageEmail(customerName, messageContent, tenantId)
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('✅ Email notification sent:', data.id);
                return { success: true, messageId: data.id };
            } else {
                console.error('❌ Failed to send email:', data.message);
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('❌ Email service error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * 生成新消息通知邮件模板
     */
    generateNewMessageEmail(customerName, messageContent, tenantId) {
        const chatUrl = `https://chat.fixturerb2b.top/admin.html`;
        
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .message-box {
            background: white;
            padding: 20px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
            border-radius: 5px;
        }
        .customer-info {
            font-size: 18px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        .message-content {
            font-size: 16px;
            color: #555;
            line-height: 1.8;
        }
        .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔔 新消息通知</h1>
        <p>您收到了一条新的客户消息</p>
    </div>
    
    <div class="content">
        <div class="customer-info">
            👤 客户: ${this.escapeHtml(customerName)}
        </div>
        
        <div class="message-box">
            <div class="message-content">
                ${this.escapeHtml(messageContent)}
            </div>
        </div>
        
        <p style="color: #666; font-size: 14px;">
            📅 时间: ${new Date().toLocaleString('zh-CN')}
        </p>
        
        <a href="${chatUrl}" class="cta-button">
            💬 立即回复
        </a>
        
        <div class="footer">
            <p>这是自动发送的通知邮件，请勿直接回复。</p>
            <p>如需管理聊天系统，请访问: <a href="${chatUrl}">${chatUrl}</a></p>
        </div>
    </div>
</body>
</html>
        `.trim();
    }

    /**
     * HTML 转义
     */
    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

module.exports = new EmailService();
