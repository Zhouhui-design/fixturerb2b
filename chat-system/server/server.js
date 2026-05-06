require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios');

const User = require('./models/User');
const Message = require('./models/Message');
const Remark = require('./models/Remark');
const Suggestion = require('./models/Suggestion');
const Tenant = require('./models/Tenant');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const suggestionRoutes = require('./routes/suggestion');
const uploadRoutes = require('./routes/upload');
const statsRoutes = require('./routes/stats');
// const voiceRoutes = require('./routes/voice'); // OpenAI Whisper - 已弃用，使用阿里云 ASR
const voiceAliyunRoutes = require('./routes/voice-aliyun');
const emailService = require('./services/emailService');

const { cleanupInactiveUsers } = require('./utils/cleanup');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);
// app.use('/api/voice', voiceRoutes); // OpenAI Whisper - 已弃用
app.use('/api/voice', voiceAliyunRoutes); // 阿里云 ASR
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

cron.schedule('0 2 * * *', async () => {
  console.log('Running cleanup for inactive users...');
  await cleanupInactiveUsers();
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  const tenantId = socket.handshake.auth.tenantId || 'fixturerb2b';
  
  if (!token) {
    return next(new Error('Authentication required'));
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new Error('User not found'));
    }
    
    // 将来源标识绑定到 socket
    socket.tenantId = tenantId;
    socket.userId = user._id;
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId} from tenant: ${socket.tenantId}`);
  
  User.findByIdAndUpdate(socket.userId, { lastActiveAt: new Date() }).exec();
  
  socket.join(`user_${socket.userId}`);
  socket.join(`tenant_${socket.tenantId}`); // 加入租户频道
  
  socket.on('send_message', async (data) => {
    try {
      const { to, content, originalLang, translatedLang } = data;
      
      const message = new Message({
        from: socket.userId,
        to: to,
        content: content,
        originalLang: originalLang || 'auto',
        translatedLang: translatedLang || 'en',
        tenantId: socket.tenantId // 记录消息来源
      });
      await message.save();
      
      io.to(`user_${to}`).emit('receive_message', {
        id: message._id,
        from: socket.userId,
        fromUsername: socket.user.username,
        content: content,
        timestamp: message.timestamp,
        originalLang: message.originalLang,
        tenantId: socket.tenantId
      });
      
      socket.emit('message_sent', { id: message._id, timestamp: message.timestamp });
      
      // 如果接收者是管理员，发送邮件通知
      const User = require('./models/User');
      const recipient = await User.findById(to);
      if (recipient && recipient.isAdmin) {
        const sender = await User.findById(socket.userId);
        if (sender) {
          // 异步发送邮件，不阻塞消息发送
          emailService.sendNewMessageNotification(
            sender.username,
            content,
            socket.tenantId
          ).catch(err => {
            console.error('Email notification failed:', err);
          });
        }
      }
    } catch (err) {
      console.error('Send message error:', err);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });
  
  socket.on('get_history', async (data) => {
    try {
      const { withUser, limit = 50 } = data;
      const messages = await Message.find({
        $or: [
          { from: socket.userId, to: withUser },
          { from: withUser, to: socket.userId }
        ],
        tenantId: socket.tenantId // 只获取当前租户的历史
      }).sort({ timestamp: -1 }).limit(limit).sort({ timestamp: 1 });
      
      socket.emit('history_result', { messages, withUser });
    } catch (err) {
      console.error('Get history error:', err);
    }
  });
  
  socket.on('translate_message', async (data) => {
    try {
      const { text, targetLang } = data;
      const response = await axios.get(`https://api.mymemory.translated.net/get`, {
        params: {
          q: text,
          langpair: `auto|${targetLang}`
        }
      });
      const translatedText = response.data.responseData.translatedText;
      socket.emit('translation_result', { original: text, translated: translatedText, targetLang });
    } catch (err) {
      console.error('Translation error:', err);
      socket.emit('translation_error', { error: 'Translation failed' });
    }
  });
  
  socket.on('video_call', (data) => {
    const { to, signal, callType, fromUsername } = data;
    console.log(`[Server] Video call from ${socket.userId} to ${to}, type: ${callType}`);
    io.to(`user_${to}`).emit('video_call', {
      from: socket.userId,
      fromUsername: fromUsername || socket.user?.username || '用户',
      signal,
      callType: callType || 'video',
      tenantId: socket.tenantId
    });
  });
  
  socket.on('answer_call', (data) => {
    const { to, signal, callType } = data;
    console.log(`[Server] Call answered by ${socket.userId} to ${to}`);
    io.to(`user_${to}`).emit('answer_call', {
      from: socket.userId,
      signal,
      callType
    });
  });
  
  socket.on('call_rejected', (data) => {
    const { to } = data;
    console.log(`[Server] Call rejected by ${socket.userId} to ${to}`);
    io.to(`user_${to}`).emit('call_rejected', {
      from: socket.userId
    });
  });
  
  socket.on('ice_candidate', (data) => {
    const { to, candidate } = data;
    io.to(`user_${to}`).emit('ice_candidate', {
      from: socket.userId,
      candidate
    });
  });
  
  socket.on('end_call', (data) => {
    const { to } = data;
    console.log(`[Server] Call ended by ${socket.userId} to ${to}`);
    io.to(`user_${to}`).emit('end_call', {
      from: socket.userId
    });
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
