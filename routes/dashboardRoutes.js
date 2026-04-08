const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Dashboard Route
router.get('/dashboard', ensureAuthenticated, dashboardController.getDashboard);

module.exports = router;
