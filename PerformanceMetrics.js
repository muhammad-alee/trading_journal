const mongoose = require('mongoose');

const PerformanceMetricsSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  totalTrades: {
    type: Number,
    default: 0
  },
  winningTrades: {
    type: Number,
    default: 0
  },
  losingTrades: {
    type: Number,
    default: 0
  },
  winRate: {
    type: Number,
    default: 0
  },
  profitFactor: {
    type: Number,
    default: 0
  },
  averageWin: {
    type: Number,
    default: 0
  },
  averageLoss: {
    type: Number,
    default: 0
  },
  largestWin: {
    type: Number,
    default: 0
  },
  largestLoss: {
    type: Number,
    default: 0
  },
  netProfit: {
    type: Number,
    default: 0
  },
  grossProfit: {
    type: Number,
    default: 0
  },
  grossLoss: {
    type: Number,
    default: 0
  },
  expectancy: {
    type: Number,
    default: 0
  },
  sharpeRatio: {
    type: Number
  },
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
PerformanceMetricsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PerformanceMetrics', PerformanceMetricsSchema);
