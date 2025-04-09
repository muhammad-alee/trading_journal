const express = require('express');
const router = express.Router();
const {
  getJournalEntries,
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} = require('./journal');

router.get('/', getJournalEntries);
router.get('/:id', getJournalEntry);
router.post('/', createJournalEntry);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

module.exports = router;
