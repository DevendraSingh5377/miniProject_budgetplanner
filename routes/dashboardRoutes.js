const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Dashboard Route
router.get('/dashboard', ensureAuthenticated, dashboardController.getDashboard);

// NEW: Breakdown Route
router.get('/breakdown', ensureAuthenticated, dashboardController.getBreakdown);

module.exports = router;