const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  remark: {
    type: String,
    required: true,
    maxlength: 100
  }
});

remarkSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });

module.exports = mongoose.model('Remark', remarkSchema);
