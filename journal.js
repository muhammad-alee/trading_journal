const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const JournalEntry = require('../models/JournalEntry');
const { check, validationResult } = require('express-validator');

// @desc    Get all journal entries
// @route   GET /api/journal
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Build query based on filter parameters
    const query = { userId: req.user.id };
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      query.createdAt = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query.createdAt = { $lte: new Date(req.query.endDate) };
    }
    
    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const total = await JournalEntry.countDocuments(query);

    // Find journal entries
    const entries = await JournalEntry.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('relatedTrades', 'symbol direction entryDate exitDate pnl');

    res.status(200).json({
      success: true,
      count: entries.length,
      total,
      data: entries
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id)
      .populate('relatedTrades', 'symbol direction entryDate exitDate pnl');

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    // Make sure user owns journal entry
    if (entry.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this journal entry'
      });
    }

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new journal entry
// @route   POST /api/journal
// @access  Private
router.post('/', [
  protect,
  check('title', 'Title is required').not().isEmpty(),
  check('content', 'Content is required').not().isEmpty(),
  check('type', 'Type is required').isIn(['daily', 'weekly', 'monthly', 'pre-market', 'post-session', 'other'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const entry = await JournalEntry.create({
      userId: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    // Make sure user owns journal entry
    if (entry.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this journal entry'
      });
    }

    entry = await JournalEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    // Make sure user owns journal entry
    if (entry.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this journal entry'
      });
    }

    await entry.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
