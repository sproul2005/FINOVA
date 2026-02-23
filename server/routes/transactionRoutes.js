const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getTransactions,
    getTransactionSummary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
} = require('../controllers/transactionController');

// Summary route MUST precede /:id to prevent summary being interpreted as an id
router.route('/summary').get(protect, getTransactionSummary);

router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

router.route('/:id')
    .put(protect, updateTransaction)
    .delete(protect, deleteTransaction);

module.exports = router;
