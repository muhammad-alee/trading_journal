const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'pre-market', 'post-session', 'other'],
    default: 'daily'
  },
  tags: [{
    type: String,
    trim: true
  }],
  relatedTrades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
JournalEntrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
