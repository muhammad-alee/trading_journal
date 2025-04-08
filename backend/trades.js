const Trade = require('../models/Trade');
const Account = require('../models/Account');
const { validationResult } = require('express-validator');

// @desc    Get all trades
// @route   GET /api/trades
// @access  Private
exports.getTrades = async (req, res) => {
  try {
    // Build query based on filter parameters
    const query = { userId: req.user.id };
    
    // Filter by account
    if (req.query.accountId) {
      query.accountId = req.query.accountId;
    }
    
    // Filter by symbol
    if (req.query.symbol) {
      query.symbol = req.query.symbol.toUpperCase();
    }
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.entryDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      query.entryDate = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query.entryDate = { $lte: new Date(req.query.endDate) };
    }
    
    // Filter by setup
    if (req.query.setupId) {
      query.setupId = req.query.setupId;
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
    const endIndex = page * limit;
    const total = await Trade.countDocuments(query);

    // Find trades
    const trades = await Trade.find(query)
      .sort({ entryDate: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('setupId', 'name')
      .populate('mistakes', 'name');

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: trades.length,
      pagination,
      total,
      data: trades
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single trade
// @route   GET /api/trades/:id
// @access  Private
exports.getTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id)
      .populate('setupId', 'name')
      .populate('mistakes', 'name')
      .populate('accountId', 'name broker');

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: 'Trade not found'
      });
    }

    // Make sure user owns trade
    if (trade.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this trade'
      });
    }

    res.status(200).json({
      success: true,
      data: trade
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new trade
// @route   POST /api/trades
// @access  Private
exports.createTrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {
    accountId,
    symbol,
    assetClass,
    direction,
    quantity,
    entryPrice,
    entryDate,
    exitPrice,
    exitDate,
    stopLoss,
    takeProfit,
    fees,
    setupId,
    tags,
    mistakes,
    notes,
    rating,
    images
  } = req.body;

  try {
    // Check if account exists and belongs to user
    const account = await Account.findById(accountId);
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }
    
    if (account.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to use this account'
      });
    }

    // Determine trade status
    const status = exitPrice && exitDate ? 'closed' : 'open';

    // Create trade
    const trade = await Trade.create({
      userId: req.user.id,
      accountId,
      symbol: symbol.toUpperCase(),
      assetClass,
      direction,
      quantity,
      entryPrice,
      entryDate,
      exitPrice,
      exitDate,
      stopLoss,
      takeProfit,
      fees: fees || 0,
      status,
      setupId,
      tags,
      mistakes,
      notes,
      rating,
      images
    });

    // Update account balance if trade is closed
    if (status === 'closed') {
      let pnl = 0;
      if (direction === 'long') {
        pnl = (exitPrice - entryPrice) * quantity - (fees || 0);
      } else {
        pnl = (entryPrice - exitPrice) * quantity - (fees || 0);
      }
      
      await Account.findByIdAndUpdate(
        accountId,
        { $inc: { currentBalance: pnl } }
      );
    }

    res.status(201).json({
      success: true,
      data: trade
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update trade
// @route   PUT /api/trades/:id
// @access  Private
exports.updateTrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: 'Trade not found'
      });
    }

    // Make sure user owns trade
    if (trade.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this trade'
      });
    }

    // Calculate old P&L if trade was closed
    let oldPnl = 0;
    if (trade.status === 'closed') {
      if (trade.direction === 'long') {
        oldPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity - trade.fees;
      } else {
        oldPnl = (trade.entryPrice - trade.exitPrice) * trade.quantity - trade.fees;
      }
    }

    // Determine new trade status
    const status = req.body.exitPrice && req.body.exitDate ? 'closed' : 'open';

    // Update trade
    trade = await Trade.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status },
      { new: true, runValidators: true }
    );

    // Update account balance if trade status changed or P&L changed
    if (status === 'closed') {
      let newPnl = 0;
      if (trade.direction === 'long') {
        newPnl = (trade.exitPrice - trade.entryPrice) * trade.quantity - trade.fees;
      } else {
        newPnl = (trade.entryPrice - trade.exitPrice) * trade.quantity - trade.fees;
      }
      
      // Only update account if P&L changed
      if (newPnl !== oldPnl) {
        const pnlDifference = newPnl - oldPnl;
        await Account.findByIdAndUpdate(
          trade.accountId,
          { $inc: { currentBalance: pnlDifference } }
        );
      }
    } else if (trade.status === 'open' && oldPnl !== 0) {
      // If trade was closed and now open, remove the P&L from account
      await Account.findByIdAndUpdate(
        trade.accountId,
        { $inc: { currentBalance: -oldPnl } }
      );
    }

    res.status(200).json({
      success: true,
      data: trade
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete trade
// @route   DELETE /api/trades/:id
// @access  Private
exports.deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: 'Trade not found'
      });
    }

    // Make sure user owns trade
    if (trade.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this trade'
      });
    }

    // If trade is closed, adjust account balance
    if (trade.status === 'closed') {
      let pnl = 0;
      if (trade.direction === 'long') {
        pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity - trade.fees;
      } else {
        pnl = (trade.entryPrice - trade.exitPrice) * trade.quantity - trade.fees;
      }
      
      await Account.findByIdAndUpdate(
        trade.accountId,
        { $inc: { currentBalance: -pnl } }
      );
    }

    await trade.remove();

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
};
