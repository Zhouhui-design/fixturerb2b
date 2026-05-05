# 群组聊天功能实施方案

## 📅 创建时间
2026-05-02

## 🎯 目标
在现有 1对1 聊天基础上，增加群组聊天功能，支持多人实时沟通。

---

## 📊 需求分析

### 核心功能

1. **群组管理**
   - 创建群组
   - 邀请成员
   - 移除成员
   - 设置管理员

2. **消息功能**
   - 群发消息
   - @提及某人
   - 文件共享
   - 消息搜索

3. **权限控制**
   - 群主权限
   - 管理员权限
   - 普通成员权限

4. **通知机制**
   - 新消息提醒
   - @提及提醒
   - 静音选项

---

## 🏗️ 数据库设计

### 1. Group 模型

**文件**: `server/models/Group.js`

```javascript
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500,
        default: ''
    },
    avatar: {
        type: String,
        default: null
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['owner', 'admin', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    settings: {
        allowMemberInvite: {
            type: Boolean,
            default: true
        },
        allowMemberMessage: {
            type: Boolean,
            default: true
        },
        isPublic: {
            type: Boolean,
            default: false
        }
    },
    tenantId: {
        type: String,
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// 更新时自动更新时间戳
groupSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Group', groupSchema);
```

### 2. 更新 Message 模型

在现有 Message 模型中添加群组支持：

```javascript
// 添加到 schema
groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
    index: true
},
mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}]
```

---

## 🔧 API 设计

### 1. 群组管理 API

**文件**: `server/routes/group.js`

```javascript
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// 创建群组
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, memberIds } = req.body;
        
        const group = new Group({
            name,
            description,
            creator: req.userId,
            tenantId: req.tenantId,
            members: [
                { user: req.userId, role: 'owner' },
                ...memberIds.map(id => ({ user: id, role: 'member' }))
            ]
        });
        
        await group.save();
        
        // 通知新成员
        memberIds.forEach(memberId => {
            io.to(`user_${memberId}`).emit('group_invite', {
                groupId: group._id,
                groupName: group.name,
                inviter: req.userId
            });
        });
        
        res.json({ success: true, group });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 获取用户的群组列表
router.get('/my-groups', authMiddleware, async (req, res) => {
    try {
        const groups = await Group.find({
            'members.user': req.userId,
            tenantId: req.tenantId
        }).populate('creator', 'username avatar')
          .populate('members.user', 'username avatar');
        
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 获取群组详情
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('creator', 'username avatar email')
            .populate('members.user', 'username avatar email')
            .populate('admins', 'username avatar');
        
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        
        // 检查用户是否是成员
        const isMember = group.members.some(m => m.user._id.toString() === req.userId);
        if (!isMember && !group.settings.isPublic) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 添加成员
router.post('/:id/members', authMiddleware, async (req, res) => {
    try {
        const { userIds } = req.body;
        const group = await Group.findById(req.params.id);
        
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        
        // 检查权限
        const currentUser = group.members.find(m => m.user.toString() === req.userId);
        if (!currentUser || 
            (currentUser.role !== 'owner' && 
             currentUser.role !== 'admin' && 
             !group.settings.allowMemberInvite)) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        
        // 添加新成员
        userIds.forEach(userId => {
            if (!group.members.some(m => m.user.toString() === userId)) {
                group.members.push({ user: userId, role: 'member' });
            }
        });
        
        await group.save();
        
        // 通知新成员
        userIds.forEach(userId => {
            io.to(`user_${userId}`).emit('group_invite', {
                groupId: group._id,
                groupName: group.name,
                inviter: req.userId
            });
        });
        
        res.json({ success: true, group });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 移除成员
router.delete('/:id/members/:userId', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        
        // 检查权限
        const currentUser = group.members.find(m => m.user.toString() === req.userId);
        const targetUser = group.members.find(m => m.user.toString() === req.params.userId);
        
        if (!currentUser || 
            (currentUser.role !== 'owner' && 
             !(currentUser.role === 'admin' && targetUser.role === 'member'))) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        
        group.members = group.members.filter(m => m.user.toString() !== req.params.userId);
        await group.save();
        
        // 通知被移除的成员
        io.to(`user_${req.params.userId}`).emit('group_removed', {
            groupId: group._id,
            groupName: group.name
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 更新群组信息
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        
        // 检查权限
        const currentUser = group.members.find(m => m.user.toString() === req.userId);
        if (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin')) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        
        const { name, description, settings } = req.body;
        
        if (name) group.name = name;
        if (description !== undefined) group.description = description;
        if (settings) group.settings = { ...group.settings, ...settings };
        
        await group.save();
        
        res.json({ success: true, group });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 删除群组
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        
        // 只有群主可以删除
        const currentUser = group.members.find(m => m.user.toString() === req.userId);
        if (!currentUser || currentUser.role !== 'owner') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        
        await Group.findByIdAndDelete(req.params.id);
        
        // 通知所有成员
        group.members.forEach(member => {
            io.to(`user_${member.user}`).emit('group_deleted', {
                groupId: group._id,
                groupName: group.name
            });
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

### 2. 群组消息 API

在现有的消息路由中添加群组支持：

```javascript
// server/routes/message.js

// 发送群组消息
router.post('/group/:groupId', authMiddleware, async (req, res) => {
    try {
        const { content, isFile, fileUrl, fileName, fileType, mentions } = req.body;
        const group = await Group.findById(req.params.groupId);
        
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        
        // 检查用户是否是成员
        const isMember = group.members.some(m => m.user.toString() === req.userId);
        if (!isMember) {
            return res.status(403).json({ error: 'Not a group member' });
        }
        
        const message = new Message({
            from: req.userId,
            to: null, // 群组消息没有特定接收者
            groupId: group._id,
            content,
            isFile: isFile || false,
            fileUrl: fileUrl || null,
            fileName: fileName || null,
            fileType: fileType || null,
            mentions: mentions || [],
            tenantId: req.tenantId
        });
        
        await message.save();
        
        // 通知所有群成员（除了发送者）
        group.members.forEach(member => {
            if (member.user.toString() !== req.userId) {
                io.to(`user_${member.user}`).emit('receive_message', {
                    ...message.toObject(),
                    isGroupMessage: true,
                    groupName: group.name
                });
                
                // 如果被 @ 提及，发送特殊通知
                if (mentions.includes(member.user.toString())) {
                    io.to(`user_${member.user}`).emit('mentioned_in_group', {
                        messageId: message._id,
                        groupId: group._id,
                        groupName: group.name,
                        from: req.userId
                    });
                }
            }
        });
        
        res.json({ success: true, message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 获取群组消息历史
router.get('/group/:groupId', authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const group = await Group.findById(req.params.groupId);
        
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        
        // 检查用户是否是成员
        const isMember = group.members.some(m => m.user.toString() === req.userId);
        if (!isMember) {
            return res.status(403).json({ error: 'Not a group member' });
        }
        
        const messages = await Message.find({
            groupId: group._id,
            tenantId: req.tenantId
        })
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('from', 'username avatar')
        .populate('mentions', 'username');
        
        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

---

## 🔌 Socket.IO 集成

在 `server/server.js` 中添加群组相关事件：

```javascript
// 加入群组房间
socket.on('join_group', async (data) => {
    try {
        const { groupId } = data;
        const group = await Group.findById(groupId);
        
        if (!group) {
            return socket.emit('error', { message: 'Group not found' });
        }
        
        const isMember = group.members.some(m => m.user.toString() === socket.userId);
        if (!isMember) {
            return socket.emit('error', { message: 'Not a group member' });
        }
        
        socket.join(`group_${groupId}`);
        console.log(`User ${socket.userId} joined group ${groupId}`);
        
        socket.emit('group_joined', { groupId, groupName: group.name });
    } catch (error) {
        console.error('Join group error:', error);
    }
});

// 离开群组房间
socket.on('leave_group', (data) => {
    const { groupId } = data;
    socket.leave(`group_${groupId}`);
    console.log(`User ${socket.userId} left group ${groupId}`);
});

// 群组中输入状态
socket.on('group_typing', (data) => {
    const { groupId, isTyping } = data;
    socket.to(`group_${groupId}`).emit('user_typing_in_group', {
        userId: socket.userId,
        groupId,
        isTyping
    });
});
```

---

## 🎨 前端实现

### 1. 群组列表组件

**文件**: `client/components/GroupList.js`

```javascript
class GroupList {
    constructor(app) {
        this.app = app;
        this.groups = [];
        this.currentGroup = null;
    }

    async loadGroups() {
        try {
            const response = await fetch('/api/group/my-groups');
            this.groups = await response.json();
            this.render();
        } catch (error) {
            console.error('Load groups error:', error);
        }
    }

    render() {
        const container = document.getElementById('group-list');
        container.innerHTML = '';

        this.groups.forEach(group => {
            const div = document.createElement('div');
            div.className = 'group-item';
            div.dataset.groupId = group._id;
            
            div.innerHTML = `
                <img src="${group.avatar || '/default-group-avatar.png'}" 
                     class="group-avatar" alt="${group.name}">
                <div class="group-info">
                    <div class="group-name">${this.escapeHtml(group.name)}</div>
                    <div class="group-members">${group.members.length} 成员</div>
                </div>
            `;
            
            div.addEventListener('click', () => this.selectGroup(group));
            container.appendChild(div);
        });
    }

    selectGroup(group) {
        this.currentGroup = group;
        this.app.switchToGroupChat(group);
        
        // 高亮当前群组
        document.querySelectorAll('.group-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-group-id="${group._id}"]`).classList.add('active');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
```

### 2. 群组聊天界面

**文件**: `client/app.js` - 添加群组聊天方法

```javascript
class ChatApp {
    // ... 现有代码

    async switchToGroupChat(group) {
        this.currentChat = null;
        this.currentGroup = group;
        
        // 更新 UI
        document.getElementById('chat-header-title').textContent = group.name;
        document.getElementById('chat-header-subtitle').textContent = 
            `${group.members.length} 成员`;
        
        // 加载群组消息
        await this.loadGroupMessages(group._id);
        
        // 加入 Socket.IO 房间
        this.socket.emit('join_group', { groupId: group._id });
    }

    async loadGroupMessages(groupId) {
        try {
            const response = await fetch(`/api/messages/group/${groupId}?page=1&limit=50`);
            const messages = await response.json();
            
            const container = document.getElementById('messages-container');
            container.innerHTML = '';
            
            messages.forEach(msg => {
                this.displayGroupMessage(msg);
            });
            
            this.scrollToBottom();
        } catch (error) {
            console.error('Load group messages error:', error);
        }
    }

    displayGroupMessage(message) {
        const isOwn = message.from._id === this.userId;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isOwn ? 'sent' : 'received'}`;
        
        const mentionClass = message.mentions.includes(this.userId) ? 'mentioned' : '';
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <img src="${message.from.avatar || '/default-avatar.png'}" 
                     class="message-avatar">
                <span class="message-sender">${message.from.username}</span>
                <span class="message-time">${this.formatTime(message.timestamp)}</span>
            </div>
            <div class="message-content ${mentionClass}">
                ${this.escapeHtml(message.content)}
            </div>
        `;
        
        document.getElementById('messages-container').appendChild(messageDiv);
    }

    async sendGroupMessage(content, mentions = []) {
        if (!this.currentGroup || !content.trim()) return;
        
        try {
            const response = await fetch(`/api/messages/group/${this.currentGroup._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    mentions
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.displayGroupMessage(result.message);
                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Send group message error:', error);
        }
    }
}
```

### 3. 创建群组对话框

**文件**: `client/index.html`

```html
<!-- 创建群组按钮 -->
<button id="create-group-btn" class="btn btn-primary">+ 创建群组</button>

<!-- 创建群组模态框 -->
<div id="create-group-modal" class="modal">
    <div class="modal-content">
        <h3>创建新群组</h3>
        <form id="create-group-form">
            <div class="form-group">
                <label>群组名称</label>
                <input type="text" name="name" required maxlength="100">
            </div>
            
            <div class="form-group">
                <label>描述（可选）</label>
                <textarea name="description" rows="3" maxlength="500"></textarea>
            </div>
            
            <div class="form-group">
                <label>邀请成员</label>
                <div id="member-selection">
                    <!-- 动态加载用户列表 -->
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">取消</button>
                <button type="submit" class="btn btn-primary">创建</button>
            </div>
        </form>
    </div>
</div>
```

---

## 📱 UI/UX 设计要点

### 1. 群组标识
- 群组头像使用首字母或图标
- 显示成员数量
- 未读消息徽章

### 2. @提及功能
- 输入 `@` 时显示成员列表
- 被提及的消息高亮显示
- 发送特殊通知

### 3. 消息展示
- 显示发送者姓名和头像
- 区分自己和他人的消息
- 时间戳格式化

### 4. 权限提示
- 非管理员隐藏管理按钮
- 无权操作时显示提示
- 友好的错误信息

---

## 🔒 安全考虑

### 1. 权限验证
- 所有 API 都需要身份验证
- 检查用户是否是群组成员
- 验证操作权限（群主/管理员/成员）

### 2. 数据隔离
- 按 tenantId 隔离不同租户的数据
- 防止跨租户访问
- SQL 注入防护

### 3. 速率限制
- 限制消息发送频率
- 防止垃圾信息
- 保护服务器资源

### 4. 内容审核
- 敏感词过滤
- 图片内容检测
- 举报机制

---

## 🧪 测试方案

### 功能测试

- [ ] 创建群组成功
- [ ] 邀请成员成功
- [ ] 成员收到邀请通知
- [ ] 发送群组消息
- [ ] 所有成员收到消息
- [ ] @提及功能正常
- [ ] 移除成员成功
- [ ] 权限控制正确
- [ ] 群组删除成功

### 性能测试

- [ ] 100人群组消息延迟 < 500ms
- [ ] 同时10个群组聊天不卡顿
- [ ] 消息历史加载速度快
- [ ] 内存占用合理

### 边界测试

- [ ] 空群组名称
- [ ] 超长消息内容
- [ ] 特殊字符处理
- [ ] 网络断开重连
- [ ] 并发操作冲突

---

## 🚀 部署计划

### 第一阶段（2周）：基础功能
- 数据库模型设计
- 群组 CRUD API
- 基础群组聊天界面

### 第二阶段（2周）：高级功能
- @提及功能
- 文件共享
- 群组设置

### 第三阶段（1周）：优化
- 性能优化
- 用户体验改进
- Bug 修复

### 第四阶段（1周）：测试与部署
- 全面测试
- 文档完善
- 生产环境部署

---

## 📊 资源需求评估

### 服务器资源

| 资源 | 额外需求 | 说明 |
|------|---------|------|
| 数据库存储 | +500MB/月 | 群组和消息数据 |
| 内存 | +100MB | Socket.IO 房间管理 |
| CPU | +10% | 消息广播 |
| 带宽 | +20% | 更多消息传输 |

### 开发资源

- **后端开发**：2周
- **前端开发**：2周
- **测试**：1周
- **总计**：5周

---

## ⚠️ 注意事项

### 1.  scalability
- 大群组（>100人）可能需要优化
- 考虑使用 Redis Pub/Sub 进行消息广播
- 消息分页加载避免一次性加载过多

### 2. 离线消息
- 用户离线时的消息存储
- 上线后推送未读消息
- 消息同步机制

### 3. 消息持久化
- 重要消息备份
- 定期清理旧消息
- 归档策略

### 4. 用户体验
- 避免消息重复显示
- 平滑的滚动体验
- 清晰的视觉反馈

---

## 📝 总结

### 技术难点
1. **实时性**：确保消息低延迟送达
2. **一致性**：多端消息同步
3. **权限管理**：复杂的角色和权限
4. **性能优化**：大群组的消息广播

### 推荐实施时机
- 当 1对1 聊天功能稳定后
- 当用户需求明确时
- 当服务器资源充足时
- 当有足够开发时间时

### 替代方案
如果开发资源有限，可以考虑：
- 使用第三方服务（如 Pusher、PubNub）
- 先实现简单的广播功能
- 逐步迭代完善

---

**创建时间**: 2026-05-02  
**状态**: 📋 待实施  
**优先级**: 中（功能扩展）  
**预计工期**: 5-6 周
