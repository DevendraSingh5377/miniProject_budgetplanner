const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Add Income Routes
router.get('/income/add', ensureAuthenticated, incomeController.getAddIncome);
router.post('/income/add', ensureAuthenticated, incomeController.postAddIncome);

// Delete Income Route
router.post('/income/delete/:id', ensureAuthenticated, incomeController.deleteIncome);

module.exports = router;
