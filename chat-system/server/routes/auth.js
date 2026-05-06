const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// 快捷登录（无需密码，但不能重复）
router.post('/register', async (req, res) => {
  try {
    const { username, tenantId } = req.body;
    const currentTenant = tenantId || 'fixturerb2b';
    
    if (!username || username.trim().length < 1) {
      return res.status(400).json({ error: '称呼不能为空' });
    }
    
    // 检查同一租户下是否有重名用户
    const existingUser = await User.findOne({ username: username.trim(), tenantId: currentTenant });
    if (existingUser) {
      return res.status(400).json({ error: '该称呼已被使用，请更换其他称呼或注册账号' });
    }
    
    const token = crypto.randomBytes(64).toString('hex');
    
    const user = new User({
      username: username.trim(),
      token: token,
      tenantId: currentTenant,
      isRegistered: false,
      accountExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 默认30天
    });
    
    await user.save();
    
    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username, tenantId: currentTenant },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      userId: user._id,
      username: user.username,
      token: jwtToken,
      message: '登录成功',
      isRegistered: false,
      isAdmin: user.isAdmin || false
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: '登录失败' });
  }
});

// 正式注册（带密码和邮箱）
router.post('/register-full', async (req, res) => {
  try {
    const { username, email, password, tenantId } = req.body;
    const currentTenant = tenantId || 'fixturerb2b';
    
    if (!username || username.trim().length < 1) {
      return res.status(400).json({ error: '用户名不能为空' });
    }
    
    if (!password || password.length < 6) {
      return res.status(400).json({ error: '密码至少需要 6 个字符' });
    }
    
    // 检查用户名是否重复
    const existingUser = await User.findOne({ username: username.trim(), tenantId: currentTenant });
    if (existingUser) {
      return res.status(400).json({ error: '用户名已被使用' });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(64).toString('hex');
    
    // 计算账号过期日期（1年后）
    const accountExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    
    const user = new User({
      username: username.trim(),
      email: email || '',
      password: hashedPassword,
      token: token,
      tenantId: currentTenant,
      isRegistered: true,
      accountExpiryDate: accountExpiryDate
    });
    
    await user.save();
    
    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username, tenantId: currentTenant },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '365d' }
    );
    
    res.status(201).json({
      userId: user._id,
      username: user.username,
      token: jwtToken,
      message: '注册成功！聊天记录将保存1年',
      isRegistered: true,
      isAdmin: user.isAdmin || false
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: '注册失败' });
  }
});

// 登录（使用用户名+密码）
router.post('/login', async (req, res) => {
  try {
    const { username, password, tenantId } = req.body;
    const currentTenant = tenantId || 'fixturerb2b';
    
    const user = await User.findOne({ username: username.trim(), tenantId: currentTenant });
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }
    
    // 如果是注册用户，验证密码
    if (user.isRegistered) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: '密码错误' });
      }
    }
    
    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await user.save();
    
    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username, tenantId: currentTenant },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: user.isRegistered ? '365d' : '30d' }
    );
    
    res.json({
      userId: user._id,
      username: user.username,
      token: jwtToken,
      message: '登录成功',
      isRegistered: user.isRegistered,
      isAdmin: user.isAdmin || false
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: '登录失败' });
  }
});

// 验证token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: '无效token' });
    }
    
    res.json({
      userId: user._id,
      username: user.username,
      tenantId: user.tenantId,
      isRegistered: user.isRegistered,
      isAdmin: user.isAdmin || false,
      message: 'Token 有效'
    });
  } catch (err) {
    res.status(401).json({ error: 'Token 无效或已过期' });
  }
});

module.exports = router;

// Get admin user for tenant
router.get('/admin', async (req, res) => {
    try {
        const { tenantId } = req.query;
        
        // Find or create admin user for this tenant
        let adminUser = await User.findOne({ 
            username: 'Admin', 
            tenantId,
            isAdmin: true 
        });
        
        if (!adminUser) {
            adminUser = new User({
                username: 'Admin',
                tenantId,
                isAdmin: true,
                isRegistered: true
            });
            await adminUser.save();
        }
        
        res.json({ 
            userId: adminUser._id, 
            username: adminUser.username 
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get admin user' });
    }
});
