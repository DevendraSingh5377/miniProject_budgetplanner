const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Add Transaction
router.post('/transactions/add', ensureAuthenticated, transactionController.addTransaction);

// Delete Transaction
router.post('/transactions/delete/:id', ensureAuthenticated, transactionController.deleteTransaction);

module.exports = router;
