const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Remark = require('../models/Remark');
const Message = require('../models/Message');

const router = express.Router();

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q, tenantId } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    
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

// Get conversations for a user
router.get('/conversations', async (req, res) => {
  try {
    const { userId, tenantId } = req.query;
    const currentTenant = tenantId || 'fixturerb2b';
    const currentUserId = new mongoose.Types.ObjectId(userId);
    
    // Find all messages involving this user
    const messages = await Message.find({
      $and: [
        { $or: [
          { from: currentUserId },
          { to: currentUserId }
        ]},
        { tenantId: currentTenant }
      ]
    }).sort({ timestamp: -1 });
    
    // Group by conversation partner
    const conversationMap = new Map();
    
    for (const msg of messages) {
      const otherUserId = msg.from.equals(currentUserId) ? msg.to : msg.from;
      const otherUserIdStr = otherUserId.toString();
      
      if (!conversationMap.has(otherUserIdStr)) {
        conversationMap.set(otherUserIdStr, {
          userId: otherUserIdStr,
          lastMessage: msg.content,
          lastTimestamp: msg.timestamp,
          unreadCount: 0
        });
      }
      
      if (msg.to.equals(currentUserId) && !msg.read) {
        const conv = conversationMap.get(otherUserIdStr);
        conv.unreadCount++;
      }
    }
    
    let conversations = Array.from(conversationMap.values());
    
    const userPromises = conversations.map(conv => 
      User.findById(conv.userId).select('username')
    );
    const users = await Promise.all(userPromises);
    
    conversations = conversations.map((conv, index) => ({
      ...conv,
      username: users[index] ? users[index].username : 'Unknown User'
    }));
    
    conversations.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
    
    res.json({ conversations });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Get all users for admin panel
router.get('/list', async (req, res) => {
  try {
    const { tenantId } = req.query;
    const currentTenant = tenantId || 'fixturerb2b';
    
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

// Get remark for a user
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

// Get user by ID - MUST BE LAST to avoid matching other routes
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

// Update social links
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

// Save remark
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

// Mark messages as read
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

module.exports = router;
