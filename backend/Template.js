const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a template name'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add template content']
  },
  type: {
    type: String,
    enum: ['journal', 'trade', 'report', 'other'],
    default: 'journal'
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
TemplateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Template', TemplateSchema);
