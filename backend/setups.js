const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Setup = require('../models/Setup');
const { check, validationResult } = require('express-validator');

// @desc    Get all setups
// @route   GET /api/setups
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const setups = await Setup.find({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: setups.length,
      data: setups
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single setup
// @route   GET /api/setups/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const setup = await Setup.findById(req.params.id);

    if (!setup) {
      return res.status(404).json({
        success: false,
        error: 'Setup not found'
      });
    }

    // Make sure user owns setup
    if (setup.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this setup'
      });
    }

    res.status(200).json({
      success: true,
      data: setup
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new setup
// @route   POST /api/setups
// @access  Private
router.post('/', [
  protect,
  check('name', 'Name is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const setup = await Setup.create({
      userId: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      data: setup
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update setup
// @route   PUT /api/setups/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let setup = await Setup.findById(req.params.id);

    if (!setup) {
      return res.status(404).json({
        success: false,
        error: 'Setup not found'
      });
    }

    // Make sure user owns setup
    if (setup.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this setup'
      });
    }

    setup = await Setup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: setup
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete setup
// @route   DELETE /api/setups/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const setup = await Setup.findById(req.params.id);

    if (!setup) {
      return res.status(404).json({
        success: false,
        error: 'Setup not found'
      });
    }

    // Make sure user owns setup
    if (setup.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this setup'
      });
    }

    await setup.remove();

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
