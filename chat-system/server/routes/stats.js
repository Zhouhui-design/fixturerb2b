const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');

// 获取统计数据
router.get('/dashboard', async (req, res) => {
    try {
        const { tenantId } = req.query;
        
        if (!tenantId) {
            return res.status(400).json({ error: 'tenantId is required' });
        }
        
        // 总用户数
        const totalUsers = await User.countDocuments({ tenantId });
        
        // 今日活跃用户（今天有消息的用户）
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayActiveUsers = await Message.distinct('from', {
            tenantId,
            timestamp: { $gte: today, $lt: tomorrow }
        });
        
        // 总消息数
        const totalMessages = await Message.countDocuments({ tenantId });
        
        // 今日消息数
        const todayMessages = await Message.countDocuments({
            tenantId,
            timestamp: { $gte: today, $lt: tomorrow }
        });
        
        // 最近7天消息趋势
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            
            const count = await Message.countDocuments({
                tenantId,
                timestamp: { $gte: date, $lt: nextDate }
            });
            
            last7Days.push({
                date: date.toISOString().split('T')[0],
                count: count
            });
        }
        
        // 在线用户数（简化版：最近5分钟有活动的用户）
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const onlineUsers = await Message.distinct('from', {
            tenantId,
            timestamp: { $gte: fiveMinutesAgo }
        });
        
        res.json({
            success: true,
            stats: {
                totalUsers,
                todayActiveUsers: todayActiveUsers.length,
                totalMessages,
                todayMessages,
                onlineUsers: onlineUsers.length,
                last7Days
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

module.exports = router;
