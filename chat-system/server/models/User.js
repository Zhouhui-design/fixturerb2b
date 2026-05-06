const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    default: '',
    index: true
  },
  password: {
    type: String,
    default: ''
  },
  socialLinks: {
    tiktok: { type: String, default: '' },
    wechat: { type: String, default: '' },
    lark: { type: String, default: '' },
    facebook: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    telegram: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  tenantId: {
    type: String,
    required: true,
    index: true,
    default: 'fixturerb2b'
  },
  isRegistered: {
    type: Boolean,
    default: false
  },
  accountExpiryDate: {
    type: Date
  },
  expirationNotified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false,
    index: true
  }
});

// 复合索引：确保同一租户下用户名唯一
userSchema.index({ username: 1, tenantId: 1 }, { unique: true });
userSchema.index({ lastActiveAt: 1 });
userSchema.index({ lastLoginAt: 1 });
userSchema.index({ accountExpiryDate: 1 });

module.exports = mongoose.model('User', userSchema);
