const mongoose = require('mongoose');

const ImportHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  fileName: {
    type: String
  },
  broker: {
    type: String,
    required: true
  },
  importType: {
    type: String,
    enum: ['csv', 'api', 'manual'],
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'partial'],
    required: true
  },
  tradesImported: {
    type: Number,
    default: 0
  },
  tradesSkipped: {
    type: Number,
    default: 0
  },
  errorLog: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ImportHistory', ImportHistorySchema);
