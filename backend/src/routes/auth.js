// src/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Login route (example)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Fake auth for example
  const user = await User.findOne({ email });
  if (!user || password !== user.password) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1d' });

  res.json({ success: true, token });
});

module.exports = router;
