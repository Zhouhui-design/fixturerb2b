const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chat_system').then(async () => {
  const User = require('./models/User');
  
  const admin = await User.findOne({ username: 'Admin' });
  console.log('Testing conversations API for Admin...');
  console.log('Admin ID:', admin._id.toString());
  
  // 模拟 API 请求
  const userId = admin._id.toString();
  const tenantId = 'fixturerb2b';
  const userIdObj = new mongoose.Types.ObjectId(userId);
  
  const Message = require('./models/Message');
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
          { tenantId: tenantId }
        ]
      }
    },
    { $sort: { timestamp: -1 } },
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
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id',
        username: '$user.username',
        lastMessage: 1,
        lastTimestamp: 1,
        unreadCount: 1
      }
    },
    { $sort: { lastTimestamp: -1 } }
  ]);
  
  console.log('\n✅ Conversations found:', conversations.length);
  conversations.forEach((conv, i) => {
    console.log(`${i + 1}. User: ${conv.username}`);
    console.log(`   Last message: ${conv.lastMessage?.substring(0, 50)}`);
    console.log(`   Unread: ${conv.unreadCount}`);
    console.log('');
  });
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
