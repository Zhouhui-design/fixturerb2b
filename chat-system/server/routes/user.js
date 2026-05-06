const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Remark = require('../models/Remark');
const Message = require('../models/Message');

const router = express.Router();

// 具体路由必须在参数路由之前定义
// 获取在线用户列表（管理员使用）
router.get('/online', async (req, res) => {
  try {
    const { tenantId } = req.query;
    const currentTenant = tenantId || 'fixturerb2b';
    
    // 获取最近5分钟有活动的用户
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const onlineUsers = await Message.distinct('from', {
      tenantId: currentTenant,
      timestamp: { $gte: fiveMinutesAgo }
    });
    
    // 获取用户详细信息
    const users = await User.find({
      _id: { $in: onlineUsers },
      tenantId: currentTenant
    }).select('_id username lastActiveAt');
    
    res.json({ 
      success: true,
      onlineUsers: users,
      count: users.length
    });
  } catch (err) {
    console.error('Get online users error:', err);
    res.status(500).json({ error: 'Failed to get online users' });
  }
});

// 获取用户对话列表（管理员使用）
router.get('/conversations', async (req, res) => {
  try {
    const { userId, tenantId } = req.query;
    const currentTenant = tenantId || 'fixturerb2b';
    
    // 将 userId 转换为 ObjectId
    const userIdObj = new mongoose.Types.ObjectId(userId);
    
    const conversations = await Message.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { from: userIdObj },
                { to: userIdObj }
              ]
            },
            { tenantId: currentTenant }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$from', userIdObj] },
              '$to',
              '$from'
            ]
          },
          lastMessage: { $first: '$content' },
          lastTimestamp: { $first: '$timestamp' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$to', userIdObj] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          username: '$user.username',
          lastMessage: 1,
          lastTimestamp: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { lastTimestamp: -1 }
      }
    ]);
    
    res.json({ conversations });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// 获取用户列表（管理员使用）
router.get('/list', async (req, res) => {
  try {
    const { tenantId } = req.query;
    const currentTenant = tenantId || 'fixturerb2b';
    
    // Get all non-admin users
    const users = await User.find({
      tenantId: currentTenant,
      isAdmin: { $ne: true }
    }).select('username _id createdAt lastActiveAt lastLoginAt isRegistered').sort({ lastActiveAt: -1 });
    
    res.json({ users });
  } catch (err) {
    console.error('Get users list error:', err);
    res.status(500).json({ error: 'Failed to get users list' });
  }
});

// 搜索用户
router.get('/search', async (req, res) => {
  try {
    const { q, tenantId } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    
    // 只搜索当前租户的用户
    const users = await User.find({
      username: { $regex: q, $options: 'i' },
      tenantId: tenantId || 'fixturerb2b'
    }).select('username _id').limit(20);
    
    res.json({ users });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// 标记消息为已读
router.post('/mark-read', async (req, res) => {
  try {
    const { userId, otherUserId, tenantId } = req.body;
    const currentTenant = tenantId || 'fixturerb2b';
    
    await Message.updateMany(
      {
        from: otherUserId,
        to: userId,
        read: false,
        tenantId: currentTenant
      },
      { $set: { read: true } }
    );
    
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// 保存备注
router.post('/remark', async (req, res) => {
  try {
    const { userId, targetUserId, remark } = req.body;
    
    if (!remark || remark.trim().length === 0) {
      return res.status(400).json({ error: 'Remark cannot be empty' });
    }
    
    const existingRemark = await Remark.findOneAndUpdate(
      { userId, targetUserId },
      { remark: remark.trim() },
      { upsert: true, new: true }
    );
    
    res.json({ remark: existingRemark, message: 'Remark saved' });
  } catch (err) {
    console.error('Save remark error:', err);
    res.status(500).json({ error: 'Failed to save remark' });
  }
});

// 获取备注
router.get('/remark/:targetUserId', async (req, res) => {
  try {
    const { userId } = req.query;
    const remark = await Remark.findOne({ userId, targetUserId: req.params.targetUserId });
    
    res.json({ remark: remark ? remark.remark : null });
  } catch (err) {
    console.error('Get remark error:', err);
    res.status(500).json({ error: 'Failed to get remark' });
  }
});

// 参数路由必须放在最后
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('username socialLinks createdAt tenantId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

router.put('/:userId/social-links', async (req, res) => {
  try {
    const { socialLinks } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { socialLinks },
      { new: true, runValidators: true }
    ).select('username socialLinks');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user, message: 'Social links updated' });
  } catch (err) {
    console.error('Update social links error:', err);
    res.status(500).json({ error: 'Failed to update social links' });
  }
});

module.exports = router;
