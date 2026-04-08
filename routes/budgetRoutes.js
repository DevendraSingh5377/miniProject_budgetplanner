const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { ensureAuthenticated } = require('../middleware/authMiddleware'); 
// Make sure you have this middleware defined

// Create Budget
router.post('/budgets', ensureAuthenticated, budgetController.createBudget);

// Get Budgets
router.get('/budgets', ensureAuthenticated, budgetController.getBudgets);

module.exports = router;
