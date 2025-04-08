const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Trade = require('../models/Trade');
const PerformanceMetrics = require('../models/PerformanceMetrics');

// @desc    Get performance metrics
// @route   GET /api/analytics/performance
// @access  Private
router.get('/performance', protect, async (req, res) => {
  try {
    const { accountId, startDate, endDate, period = 'daily' } = req.query;
    
    // Build query
    const query = { userId: req.user.id };
    
    if (accountId) {
      query.accountId = accountId;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }
    
    query.period = period;
    
    // Get metrics from database or calculate on the fly
    const metrics = await PerformanceMetrics.find(query).sort({ date: 1 });
    
    // If no metrics found, calculate them
    if (metrics.length === 0) {
      // Build trade query
      const tradeQuery = { userId: req.user.id, status: 'closed' };
      
      if (accountId) {
        tradeQuery.accountId = accountId;
      }
      
      if (startDate && endDate) {
        tradeQuery.exitDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      } else if (startDate) {
        tradeQuery.exitDate = { $gte: new Date(startDate) };
      } else if (endDate) {
        tradeQuery.exitDate = { $lte: new Date(endDate) };
      }
      
      // Get trades
      const trades = await Trade.find(tradeQuery);
      
      // Calculate metrics
      const calculatedMetrics = {
        totalTrades: trades.length,
        winningTrades: trades.filter(trade => trade.pnl > 0).length,
        losingTrades: trades.filter(trade => trade.pnl <= 0).length,
        netProfit: trades.reduce((sum, trade) => sum + trade.pnl, 0),
        grossProfit: trades.filter(trade => trade.pnl > 0).reduce((sum, trade) => sum + trade.pnl, 0),
        grossLoss: trades.filter(trade => trade.pnl <= 0).reduce((sum, trade) => sum + trade.pnl, 0),
      };
      
      calculatedMetrics.winRate = calculatedMetrics.totalTrades > 0 
        ? (calculatedMetrics.winningTrades / calculatedMetrics.totalTrades) * 100 
        : 0;
        
      calculatedMetrics.profitFactor = calculatedMetrics.grossLoss !== 0 
        ? Math.abs(calculatedMetrics.grossProfit / calculatedMetrics.grossLoss) 
        : calculatedMetrics.grossProfit > 0 ? 999 : 0;
        
      calculatedMetrics.averageWin = calculatedMetrics.winningTrades > 0 
        ? calculatedMetrics.grossProfit / calculatedMetrics.winningTrades 
        : 0;
        
      calculatedMetrics.averageLoss = calculatedMetrics.losingTrades > 0 
        ? calculatedMetrics.grossLoss / calculatedMetrics.losingTrades 
        : 0;
        
      calculatedMetrics.expectancy = calculatedMetrics.totalTrades > 0 
        ? (calculatedMetrics.winRate / 100 * calculatedMetrics.averageWin) + 
          ((1 - calculatedMetrics.winRate / 100) * calculatedMetrics.averageLoss) 
        : 0;
      
      return res.status(200).json({
        success: true,
        data: calculatedMetrics
      });
    }
    
    res.status(200).json({
      success: true,
      count: metrics.length,
      data: metrics
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get trade analysis
// @route   GET /api/analytics/trades
// @access  Private
router.get('/trades', protect, async (req, res) => {
  try {
    const { accountId, startDate, endDate, groupBy = 'symbol' } = req.query;
    
    // Build query
    const query = { userId: req.user.id, status: 'closed' };
    
    if (accountId) {
      query.accountId = accountId;
    }
    
    if (startDate && endDate) {
      query.exitDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.exitDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.exitDate = { $lte: new Date(endDate) };
    }
    
    // Get trades
    const trades = await Trade.find(query);
    
    // Group trades
    const groupedTrades = {};
    
    trades.forEach(trade => {
      let key;
      
      switch(groupBy) {
        case 'symbol':
          key = trade.symbol;
          break;
        case 'direction':
          key = trade.direction;
          break;
        case 'assetClass':
          key = trade.assetClass;
          break;
        case 'setup':
          key = trade.setupId ? trade.setupId.toString() : 'No Setup';
          break;
        default:
          key = trade.symbol;
      }
      
      if (!groupedTrades[key]) {
        groupedTrades[key] = {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          netProfit: 0,
          grossProfit: 0,
          grossLoss: 0,
          winRate: 0,
          profitFactor: 0,
          averageWin: 0,
          averageLoss: 0,
          expectancy: 0
        };
      }
      
      groupedTrades[key].totalTrades++;
      
      if (trade.pnl > 0) {
        groupedTrades[key].winningTrades++;
        groupedTrades[key].grossProfit += trade.pnl;
      } else {
        groupedTrades[key].losingTrades++;
        groupedTrades[key].grossLoss += trade.pnl;
      }
      
      groupedTrades[key].netProfit += trade.pnl;
    });
    
    // Calculate metrics for each group
    Object.keys(groupedTrades).forEach(key => {
      const group = groupedTrades[key];
      
      group.winRate = group.totalTrades > 0 
        ? (group.winningTrades / group.totalTrades) * 100 
        : 0;
        
      group.profitFactor = group.grossLoss !== 0 
        ? Math.abs(group.grossProfit / group.grossLoss) 
        : group.grossProfit > 0 ? 999 : 0;
        
      group.averageWin = group.winningTrades > 0 
        ? group.grossProfit / group.winningTrades 
        : 0;
        
      group.averageLoss = group.losingTrades > 0 
        ? group.grossLoss / group.losingTrades 
        : 0;
        
      group.expectancy = group.totalTrades > 0 
        ? (group.winRate / 100 * group.averageWin) + 
          ((1 - group.winRate / 100) * group.averageLoss) 
        : 0;
    });
    
    res.status(200).json({
      success: true,
      data: groupedTrades
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
