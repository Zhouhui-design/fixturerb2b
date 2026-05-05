# AI 自动回复功能实施方案

## 📅 创建时间
2026-05-02

## 🎯 目标
集成 AI 助手，实现智能自动回复，提升客服效率。

---

## 📊 技术方案对比

### 方案 A: OpenAI GPT API（推荐）⭐

**优势**：
- ✅ 对话质量高
- ✅ 支持多语言
- ✅ 可定制性强
- ✅ 生态成熟

**劣势**：
- ❌ 按 token 计费
- ❌ 需要科学上网（国内）
- ❌ 数据隐私考虑

**成本**：约 $0.002/1K tokens（GPT-3.5-turbo）

---

### 方案 B: 阿里云通义千问

**优势**：
- ✅ 国内访问速度快
- ✅ 中文理解好
- ✅ 符合数据合规
- ✅ 价格相对较低

**劣势**：
- ❌ 国际化支持较弱
- ❌ 生态相对较小

**成本**：约 ¥0.008/1K tokens

---

### 方案 C: 百度文心一言

**优势**：
- ✅ 完全免费额度充足
- ✅ 中文优化好
- ✅ 百度生态整合

**劣势**：
- ❌ API 稳定性一般
- ❌ 文档不够完善

**成本**：免费额度 + 付费

---

### 方案 D: 本地部署开源模型

**优势**：
- ✅ 完全自主可控
- ✅ 无 API 费用
- ✅ 数据隐私最佳

**劣势**：
- ❌ 需要强大硬件（GPU）
- ❌ 维护成本高
- ❌ 响应速度慢

**推荐模型**：Llama 2、ChatGLM、Qwen

---

## 🏗️ 推荐方案

**初期**：OpenAI GPT-3.5-turbo（快速验证）  
**中期**：根据用户分布选择（国内用阿里/百度，国际用 OpenAI）  
**长期**：混合方案 + 本地模型兜底

---

## 🔧 功能设计

### 核心功能

1. **智能问答**
   - 基于产品知识库回答
   - 常见问题自动回复
   - 多轮对话上下文

2. **意图识别**
   - 区分咨询/投诉/建议
   - 紧急程度判断
   - 转人工时机

3. **个性化回复**
   - 学习历史对话
   - 用户偏好记忆
   - 语气风格调整

4. **人机协作**
   - AI 生成草稿，人工确认
   - 人工接管机制
   - AI 辅助建议

---

## 📐 系统架构

```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Node.js     │
│  Server      │◄────► Knowledge Base
└──────┬───────┘         (Product Info)
       │
       ▼
┌──────────────┐
│  AI Service  │
│  (OpenAI)    │
└──────────────┘
```

---

## 💻 实施步骤

### 步骤 1: 安装依赖

```bash
cd /var/www/chat-system/server
npm install openai dotenv
```

### 步骤 2: 配置 API Key

**文件**: `server/.env`

```bash
OPENAI_API_KEY=sk-your-api-key-here
AI_MODEL=gpt-3.5-turbo
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=500
```

### 步骤 3: 创建 AI 服务模块

**文件**: `server/services/aiService.js`

```javascript
const OpenAI = require('openai');

class AIService {
    constructor() {
        this.openai = null;
        this.init();
    }

    init() {
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            console.warn('⚠️  OPENAI_API_KEY 未配置，AI 功能将不可用');
            return;
        }

        this.openai = new OpenAI({
            apiKey: apiKey
        });

        console.log('✅ AI Service initialized');
    }

    /**
     * 生成自动回复
     */
    async generateReply(userMessage, conversationHistory = [], context = {}) {
        if (!this.openai) {
            return { success: false, error: 'AI service not initialized' };
        }

        try {
            const systemPrompt = this.buildSystemPrompt(context);
            
            const messages = [
                { role: 'system', content: systemPrompt },
                ...conversationHistory.slice(-10), // 保留最近10条消息
                { role: 'user', content: userMessage }
            ];

            const completion = await this.openai.chat.completions.create({
                model: process.env.AI_MODEL || 'gpt-3.5-turbo',
                messages: messages,
                temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
                max_tokens: parseInt(process.env.AI_MAX_TOKENS || '500'),
                presence_penalty: 0.6,
                frequency_penalty: 0.5
            });

            const reply = completion.choices[0].message.content;

            return {
                success: true,
                reply: reply,
                usage: completion.usage
            };
        } catch (error) {
            console.error('AI generation error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * 构建系统提示词
     */
    buildSystemPrompt(context) {
        const { productName, companyName, language } = context;

        return `你是 ${companyName || 'Fixturerb2b'} 的智能客服助手。

产品信息：
${productName || '展览展示器材、展架、展示道具等B2B产品'}

你的职责：
1. 专业、友好地回答客户问题
2. 提供准确的产品信息
3. 引导客户完成购买流程
4. 处理常见售后问题
5. 遇到无法回答的问题时，礼貌地转接人工客服

回复要求：
- 使用${language || '中文'}回复
- 语气亲切、专业
- 简洁明了，避免冗长
- 适当使用表情符号增加亲和力
- 每次回复控制在200字以内

注意事项：
- 不要承诺无法保证的事情
- 不要提供虚假价格或库存信息
- 涉及具体订单时，建议联系客服查询
- 保护用户隐私，不询问敏感信息`;
    }

    /**
     * 判断是否需要转人工
     */
    async shouldTransferToHuman(userMessage, confidence = 0.7) {
        if (!this.openai) return { needTransfer: false };

        try {
            const prompt = `判断以下用户消息是否需要转接人工客服。
如果包含以下情况，返回 true：
- 投诉或强烈不满
- 复杂的技术问题
- 订单纠纷
- 退款请求
- 其他AI无法处理的问题

用户消息：${userMessage}

只返回 JSON 格式：{"needTransfer": true/false, "reason": "原因"}`;

            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 100
            });

            const result = JSON.parse(completion.choices[0].message.content);
            
            return {
                needTransfer: result.needTransfer,
                reason: result.reason,
                confidence: confidence
            };
        } catch (error) {
            console.error('Transfer check error:', error.message);
            return { needTransfer: false };
        }
    }

    /**
     * 提取用户意图
     */
    async extractIntent(userMessage) {
        if (!this.openai) return { intent: 'unknown' };

        try {
            const prompt = `分析以下用户消息的意图，返回JSON格式：
{
  "intent": "inquiry|complaint|suggestion|order|support|other",
  "urgency": "low|medium|high",
  "topics": ["topic1", "topic2"]
}

用户消息：${userMessage}`;

            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 150
            });

            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Intent extraction error:', error.message);
            return { intent: 'unknown' };
        }
    }

    /**
     * 生成回复建议（供人工客服参考）
     */
    async generateSuggestion(userMessage, context = {}) {
        const result = await this.generateReply(userMessage, [], context);
        
        if (result.success) {
            return {
                success: true,
                suggestion: result.reply,
                note: '此回复由 AI 生成，请确认后发送'
            };
        }
        
        return result;
    }
}

module.exports = new AIService();
```

### 步骤 4: 创建 AI 路由

**文件**: `server/routes/ai.js`

```javascript
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

// 获取 AI 回复
router.post('/reply', authMiddleware, async (req, res) => {
    try {
        const { message, conversationId, context } = req.body;

        // 获取对话历史
        const history = await Message.find({
            $or: [
                { from: req.userId, to: conversationId },
                { from: conversationId, to: req.userId }
            ]
        })
        .sort({ timestamp: -1 })
        .limit(10)
        .then(messages => 
            messages.reverse().map(msg => ({
                role: msg.from === req.userId ? 'user' : 'assistant',
                content: msg.content
            }))
        );

        // 生成回复
        const result = await aiService.generateReply(message, history, context);

        if (result.success) {
            // 检查是否需要转人工
            const transferCheck = await aiService.shouldTransferToHuman(message);

            res.json({
                success: true,
                reply: result.reply,
                needTransfer: transferCheck.needTransfer,
                transferReason: transferCheck.reason,
                usage: result.usage
            });
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 获取回复建议（管理员用）
router.post('/suggestion', authMiddleware, async (req, res) => {
    try {
        const { message, context } = req.body;
        
        const result = await aiService.generateSuggestion(message, context);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 分析用户意图
router.post('/intent', authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;
        
        const intent = await aiService.extractIntent(message);
        
        res.json({ success: true, intent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI 使用统计
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        // 从数据库或缓存获取统计数据
        res.json({
            totalQueries: 0,
            avgResponseTime: 0,
            transferRate: 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

**在 server.js 中注册**：

```javascript
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);
```

### 步骤 5: 前端集成

**文件**: `client/app.js` - 添加 AI 自动回复逻辑

```javascript
class ChatApp {
    constructor() {
        // ... 现有代码
        this.aiEnabled = false;
        this.autoReplyDelay = 1000; // 1秒延迟，模拟打字
    }

    // 在 receive_message 事件中添加
    setupSocketListeners() {
        this.socket.on('receive_message', async (data) => {
            // 显示消息
            this.displayMessage(data, 'received');
            
            // 如果是管理员发送给客户，且启用了 AI
            if (this.aiEnabled && data.from.isAdmin) {
                // 这里可以实现 AI 辅助功能
            }
            
            // 如果是客户发送给管理员，触发 AI 自动回复
            if (!data.from.isAdmin && this.currentChat === 'admin') {
                await this.handleAutoReply(data);
            }
        });
    }

    async handleAutoReply(userMessage) {
        // 检查是否应该自动回复
        if (!this.shouldAutoReply()) return;

        try {
            // 显示"正在输入"状态
            this.showTypingIndicator();

            // 调用 AI API
            const response = await fetch('/api/ai/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    conversationId: this.currentChat,
                    context: {
                        companyName: 'Fixturerb2b',
                        language: 'zh-CN'
                    }
                })
            });

            const result = await response.json();

            // 隐藏"正在输入"
            this.hideTypingIndicator();

            if (result.success) {
                // 延迟发送，模拟人工打字
                setTimeout(() => {
                    this.socket.emit('send_message', {
                        to: userMessage.from,
                        content: result.reply,
                        isAI: true
                    });
                }, this.autoReplyDelay);

                // 如果需要转人工，通知管理员
                if (result.needTransfer) {
                    this.notifyAdminForTransfer(userMessage, result.transferReason);
                }
            }
        } catch (error) {
            console.error('Auto reply error:', error);
            this.hideTypingIndicator();
        }
    }

    shouldAutoReply() {
        // 只在以下情况自动回复：
        // 1. AI 功能已启用
        // 2. 当前是工作时间外
        // 3. 管理员不在线
        // 4. 不是紧急消息
        
        return this.aiEnabled && 
               !this.isBusinessHours() && 
               !this.adminOnline &&
               !this.isUrgentMessage();
    }

    isBusinessHours() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        // 工作日 9:00-18:00
        return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
    }

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        
        document.getElementById('messages-container').appendChild(indicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    notifyAdminForTransfer(userMessage, reason) {
        // 发送邮件或推送通知给管理员
        this.socket.emit('transfer_request', {
            userId: userMessage.from,
            userName: userMessage.from.username,
            message: userMessage.content,
            reason: reason
        });
    }
}
```

### 步骤 6: 管理员后台 AI 控制面板

**文件**: `client/admin.html` - 添加 AI 设置

```html
<!-- AI 设置面板 -->
<div class="ai-settings">
    <h3>🤖 AI 自动回复设置</h3>
    
    <div class="setting-item">
        <label>
            <input type="checkbox" id="ai-enabled">
            启用 AI 自动回复
        </label>
    </div>
    
    <div class="setting-item">
        <label>自动回复时段</label>
        <select id="auto-reply-schedule">
            <option value="offline">仅离线时</option>
            <option value="after_hours">下班时间</option>
            <option value="always">始终启用</option>
        </select>
    </div>
    
    <div class="setting-item">
        <label>回复延迟（秒）</label>
        <input type="number" id="reply-delay" min="0" max="10" value="1">
    </div>
    
    <div class="setting-item">
        <label>自定义提示词</label>
        <textarea id="custom-prompt" rows="5" 
            placeholder="输入自定义的系统提示词..."></textarea>
    </div>
    
    <button id="save-ai-settings" class="btn btn-primary">保存设置</button>
</div>

<!-- AI 使用统计 -->
<div class="ai-stats">
    <h4>📊 今日统计</h4>
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-value" id="ai-queries-today">0</div>
            <div class="stat-label">AI 回复次数</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" id="transfer-rate">0%</div>
            <div class="stat-label">转人工率</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" id="avg-response-time">0s</div>
            <div class="stat-label">平均响应时间</div>
        </div>
    </div>
</div>
```

---

## 🎓 知识库构建

### 1. 产品信息库

**文件**: `server/data/productKnowledge.json`

```json
{
  "products": [
    {
      "name": "易拉宝",
      "category": "展架",
      "description": "便携式展示架，适合室内活动",
      "sizes": ["80x200cm", "85x200cm", "120x200cm"],
      "materials": ["铝合金", "塑钢"],
      "price_range": "¥150-500",
      "faq": [
        {
          "question": "易拉宝可以户外使用吗？",
          "answer": "标准款适合室内使用，如需户外使用建议选择防风加固款。"
        },
        {
          "question": "画面可以更换吗？",
          "answer": "是的，画面可以单独更换，我们提供多种尺寸的画面定制服务。"
        }
      ]
    },
    {
      "name": "X展架",
      "category": "展架",
      "description": "经济实惠的展示解决方案",
      "sizes": ["60x160cm", "80x180cm"],
      "materials": ["铁质", "碳纤维"],
      "price_range": "¥50-200",
      "faq": []
    }
  ],
  "shipping": {
    "domestic": "3-5个工作日",
    "international": "7-15个工作日",
    "free_shipping_threshold": "¥500"
  },
  "payment": {
    "methods": ["支付宝", "微信支付", "银行转账", "PayPal"],
    "terms": "预付50%，发货前付清余款"
  }
}
```

### 2. RAG（检索增强生成）

使用向量数据库存储知识，提高回答准确性：

```bash
npm install chromadb langchain
```

```javascript
const { Chroma } = require('chromadb');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');

class KnowledgeBase {
    constructor() {
        this.client = new Chroma();
        this.embeddings = new OpenAIEmbeddings();
    }

    async addDocument(text, metadata = {}) {
        const embedding = await this.embeddings.embedQuery(text);
        
        await this.client.addDocuments({
            ids: [metadata.id],
            embeddings: [embedding],
            metadatas: [metadata],
            documents: [text]
        });
    }

    async search(query, topK = 5) {
        const queryEmbedding = await this.embeddings.embedQuery(query);
        
        const results = await this.client.query({
            queryEmbeddings: [queryEmbedding],
            nResults: topK
        });

        return results.documents[0];
    }
}
```

---

## 🧪 测试方案

### 功能测试

- [ ] AI 回复生成正常
- [ ] 多轮对话上下文连贯
- [ ] 转人工判断准确
- [ ] 意图识别正确
- [ ] 回复速度合理（< 3秒）

### 质量评估

1. **相关性**：回复是否与问题相关
2. **准确性**：信息是否正确
3. **友好度**：语气是否合适
4. **完整性**：是否充分回答问题

### A/B 测试

- 对照组：纯人工客服
- 实验组：AI + 人工
- 指标：响应时间、满意度、转化率

---

## 📊 成本估算

### OpenAI API 费用

假设日均 100 次对话，每次 500 tokens：

```
每日消耗：100 × 500 = 50,000 tokens
每月消耗：50,000 × 30 = 1,500,000 tokens

GPT-3.5-turbo 价格：$0.002/1K tokens
月费用：1,500 × $0.002 = $3 ≈ ¥21
```

**非常便宜！**

### 其他方案对比

| 方案 | 月费用（100次/天） | 说明 |
|------|-------------------|------|
| GPT-3.5 | $3 / ¥21 | 推荐 |
| GPT-4 | $60 / ¥420 | 质量更高 |
| 通义千问 | ¥50 | 国内可用 |
| 文心一言 | ¥0-100 | 有免费额度 |
| 本地部署 | ¥500+ | 服务器成本 |

---

## ⚠️ 注意事项

### 1. 成本控制
- 设置每日预算上限
- 监控 API 使用量
- 缓存常见问题的回复

### 2. 质量保证
- 定期审查 AI 回复
- 收集用户反馈
- 持续优化提示词

### 3. 数据安全
- 不发送敏感信息给 AI
- 遵守数据隐私法规
- 用户同意使用 AI

### 4. 用户体验
- 明确告知用户使用 AI
- 提供转人工选项
- 不要让 AI 过度拟人化

### 5. 合规性
- 符合当地 AI 使用法规
- 透明披露 AI 身份
- 保留人工审核机制

---

## 🚀 实施路线图

### Phase 1: 基础版（1周）
- 集成 OpenAI API
- 实现基本自动回复
- 简单的提示词工程

### Phase 2: 增强版（2周）
- 添加知识库
- 实现意图识别
- 转人工机制

### Phase 3: 高级版（2周）
- RAG 检索增强
- 个性化回复
- 数据分析面板

### Phase 4: 优化版（持续）
- A/B 测试
- 提示词优化
- 成本控制

---

## 📈 预期效果

| 指标 | 改善前 | 改善后 | 提升 |
|------|--------|--------|------|
| 响应时间 | 5-30分钟 | < 3秒 | **99%+** |
| 客服工作量 | 100% | 40% | **降低60%** |
| 客户满意度 | 未知 | > 4.0/5 | **显著提升** |
| 运营成本 | 高 | 低 | **节省70%** |
| 服务时间 | 工作时间 | 7×24 | **全天候** |

---

## 📝 总结

### 优势
- ✅ 大幅降低客服成本
- ✅ 提供 7×24 小时服务
- ✅ 响应速度快
- ✅ 一致性高

### 挑战
- ⚠️ 需要持续优化
- ⚠️ 无法处理所有场景
- ⚠️ 可能产生错误信息
- ⚠️ 需要人工监督

### 推荐实施时机
- ✅ 当客服压力大时
- ✅ 当常见问题重复率高
- ✅ 当需要扩展服务时间
- ✅ 当预算允许时

### 暂缓原因
目前聊天系统用户量不大，人工客服完全可以应对。建议：
1. 先积累对话数据
2. 识别高频问题
3. 当人工成本过高时再引入 AI

---

**创建时间**: 2026-05-02  
**状态**: 📋 暂缓实施  
**优先级**: 低（视业务增长而定）  
**预计工期**: 5-7 周  
**预估成本**: ¥21-420/月（API 费用）
