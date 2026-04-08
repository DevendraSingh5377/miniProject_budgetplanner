const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Add Expense Routes
router.get('/expenses/add', ensureAuthenticated, expenseController.getAddExpense);
router.post('/expenses/add', ensureAuthenticated, expenseController.postAddExpense);

// Delete Expense Route
router.post('/expenses/delete/:id', ensureAuthenticated, expenseController.deleteExpense);

module.exports = router;
