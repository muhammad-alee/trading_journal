const express = require('express');
const router = express.Router();
const {
  getSetups,
  getSetup,
  createSetup,
  updateSetup,
  deleteSetup,
} = require('./setups');

router.get('/', getSetups);
router.get('/:id', getSetup);
router.post('/', createSetup);
router.put('/:id', updateSetup);
router.delete('/:id', deleteSetup);

module.exports = router;
