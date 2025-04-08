const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
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
  symbol: {
    type: String,
    required: [true, 'Please add a symbol'],
    trim: true,
    uppercase: true
  },
  assetClass: {
    type: String,
    enum: ['stock', 'option', 'future', 'forex', 'crypto', 'other'],
    default: 'stock'
  },
  direction: {
    type: String,
    enum: ['long', 'short'],
    required: [true, 'Please specify trade direction']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add a quantity'],
    min: [0, 'Quantity must be positive']
  },
  entryPrice: {
    type: Number,
    required: [true, 'Please add an entry price'],
    min: [0, 'Entry price must be positive']
  },
  entryDate: {
    type: Date,
    required: [true, 'Please add an entry date']
  },
  exitPrice: {
    type: Number,
    min: [0, 'Exit price must be positive']
  },
  exitDate: {
    type: Date
  },
  stopLoss: {
    type: Number,
    min: [0, 'Stop loss must be positive']
  },
  takeProfit: {
    type: Number,
    min: [0, 'Take profit must be positive']
  },
  fees: {
    type: Number,
    default: 0
  },
  pnl: {
    type: Number,
    default: 0
  },
  pnlPercentage: {
    type: Number,
    default: 0
  },
  rMultiple: {
    type: Number
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  setupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Setup'
  },
  tags: [{
    type: String,
    trim: true
  }],
  mistakes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mistake'
  }],
  notes: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  images: [{
    type: String
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
TradeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate P&L before saving if trade is closed
TradeSchema.pre('save', function(next) {
  if (this.status === 'closed' && this.exitPrice && this.entryPrice && this.quantity) {
    // Calculate P&L
    if (this.direction === 'long') {
      this.pnl = (this.exitPrice - this.entryPrice) * this.quantity - this.fees;
    } else {
      this.pnl = (this.entryPrice - this.exitPrice) * this.quantity - this.fees;
    }
    
    // Calculate P&L percentage
    this.pnlPercentage = (this.pnl / (this.entryPrice * this.quantity)) * 100;
    
    // Calculate R-Multiple if stop loss is set
    if (this.stopLoss) {
      const risk = this.direction === 'long' 
        ? (this.entryPrice - this.stopLoss) * this.quantity
        : (this.stopLoss - this.entryPrice) * this.quantity;
        
      if (risk > 0) {
        this.rMultiple = this.pnl / risk;
      }
    }
  }
  next();
});

module.exports = mongoose.model('Trade', TradeSchema);
