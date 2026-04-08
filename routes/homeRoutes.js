const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Home Page Route
router.get('/home', homeController.getHome);

module.exports = router;
