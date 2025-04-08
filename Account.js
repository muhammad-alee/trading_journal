const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add an account name'],
    trim: true
  },
  broker: {
    type: String,
    required: [true, 'Please add a broker name'],
    trim: true
  },
  accountType: {
    type: String,
    enum: ['cash', 'margin', 'ira', 'crypto', 'forex', 'futures'],
    default: 'cash'
  },
  currency: {
    type: String,
    required: [true, 'Please add a currency'],
    default: 'USD'
  },
  initialBalance: {
    type: Number,
    required: [true, 'Please add an initial balance'],
    default: 0
  },
  currentBalance: {
    type: Number,
    default: function() {
      return this.initialBalance;
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
AccountSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Account', AccountSchema);
