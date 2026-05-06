const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  votes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'implemented', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

suggestionSchema.index({ votes: -1 });
suggestionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Suggestion', suggestionSchema);
