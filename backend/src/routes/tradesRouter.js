const express = require('express');
const router = express.Router();
const {
  getTrades,
  getTrade,
  createTrade,
  updateTrade,
  deleteTrade,
} = require('./trades');

router.get('/', getTrades);
router.get('/:id', getTrade);
router.post('/', createTrade);
router.put('/:id', updateTrade);
router.delete('/:id', deleteTrade);

module.exports = router;
