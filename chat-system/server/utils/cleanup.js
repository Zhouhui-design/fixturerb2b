const User = require('../models/User');
const Message = require('../models/Message');

async function cleanupInactiveUsers() {
  try {
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    
    // 1. 查找即将到期（1个月内）且未通知的注册用户
    const expiringSoonUsers = await User.find({
      isRegistered: true,
      accountExpiryDate: { $lte: oneMonthFromNow, $gt: now },
      expirationNotified: { $ne: true }
    });
    
    console.log(`Found ${expiringSoonUsers.length} users expiring soon`);
    
    for (const user of expiringSoonUsers) {
      if (user.email) {
        // TODO: 发送邮件通知
        console.log(`Would send expiration notice to: ${user.email}`);
        // 标记为已通知
        user.expirationNotified = true;
        await user.save();
      }
    }
    
    // 2. 查找已过期的账号并删除
    const expiredUsers = await User.find({
      accountExpiryDate: { $lte: now }
    });
    
    console.log(`Found ${expiredUsers.length} expired accounts to delete`);
    
    for (const user of expiredUsers) {
      // 删除该用户的所有消息
      await Message.deleteMany({
        $or: [
          { from: user._id },
          { to: user._id }
        ],
        tenantId: user.tenantId
      });
      
      await user.deleteOne();
      console.log(`Deleted expired user: ${user.username}`);
    }
    
    // 3. 查找1年未登录的非注册用户（游客）
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const inactiveGuests = await User.find({
      isRegistered: false,
      lastActiveAt: { $lt: oneYearAgo }
    });
    
    console.log(`Found ${inactiveGuests.length} inactive guest users to clean up`);
    
    for (const user of inactiveGuests) {
      await Message.deleteMany({
        $or: [
          { from: user._id },
          { to: user._id }
        ],
        tenantId: user.tenantId
      });
      
      await user.deleteOne();
      console.log(`Deleted inactive guest: ${user.username}`);
    }
    
    console.log('Cleanup completed successfully');
  } catch (err) {
    console.error('Cleanup error:', err);
  }
}

module.exports = { cleanupInactiveUsers };
