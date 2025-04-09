const express = require('express');
const router = express.Router();
const {
  getPerformanceMetrics,
  getWinRate,
  getProfitFactor,
} = require('./analytics');

router.get('/performance-metrics', getPerformanceMetrics);
router.get('/win-rate', getWinRate);
router.get('/profit-factor', getProfitFactor);

module.exports = router;
