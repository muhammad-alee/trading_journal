const mongoose = require('mongoose');

const BacktestingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a session name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  symbol: {
    type: String,
    required: [true, 'Please add a symbol'],
    trim: true,
    uppercase: true
  },
  timeframe: {
    type: String,
    required: [true, 'Please add a timeframe'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  initialCapital: {
    type: Number,
    required: [true, 'Please add initial capital'],
    min: [0, 'Initial capital must be positive']
  },
  positionSize: {
    type: String,
    enum: ['fixed', 'percentage'],
    default: 'percentage'
  },
  positionSizeValue: {
    type: Number,
    required: [true, 'Please add position size value']
  },
  trades: [{
    entryDate: {
      type: Date,
      required: true
    },
    entryPrice: {
      type: Number,
      required: true
    },
    exitDate: {
      type: Date,
      required: true
    },
    exitPrice: {
      type: Number,
      required: true
    },
    direction: {
      type: String,
      enum: ['long', 'short'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    pnl: {
      type: Number,
      required: true
    },
    pnlPercentage: {
      type: Number,
      required: true
    }
  }],
  metrics: {
    totalTrades: {
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
    netProfit: {
      type: Number,
      default: 0
    },
    maxDrawdown: {
      type: Number,
      default: 0
    },
    sharpeRatio: {
      type: Number,
      default: 0
    }
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
BacktestingSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BacktestingSession', BacktestingSessionSchema);
