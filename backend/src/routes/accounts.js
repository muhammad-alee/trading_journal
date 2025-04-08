const Account = require('../models/Account');
const { validationResult } = require('express-validator');

// @desc    Get all accounts for a user
// @route   GET /api/accounts
// @access  Private
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single account
// @route   GET /api/accounts/:id
// @access  Private
exports.getAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    // Make sure user owns account
    if (account.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this account'
      });
    }

    res.status(200).json({
      success: true,
      data: account
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
exports.createAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, broker, accountType, currency, initialBalance } = req.body;

  try {
    const account = await Account.create({
      userId: req.user.id,
      name,
      broker,
      accountType,
      currency,
      initialBalance,
      currentBalance: initialBalance
    });

    res.status(201).json({
      success: true,
      data: account
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
exports.updateAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, broker, accountType, currency, initialBalance } = req.body;

  try {
    let account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    // Make sure user owns account
    if (account.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this account'
      });
    }

    // Calculate new current balance if initial balance changes
    let newCurrentBalance = account.currentBalance;
    if (initialBalance !== account.initialBalance) {
      const difference = initialBalance - account.initialBalance;
      newCurrentBalance = account.currentBalance + difference;
    }

    account = await Account.findByIdAndUpdate(
      req.params.id,
      {
        name,
        broker,
        accountType,
        currency,
        initialBalance,
        currentBalance: newCurrentBalance
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: account
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    // Make sure user owns account
    if (account.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this account'
      });
    }

    await account.remove();

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
