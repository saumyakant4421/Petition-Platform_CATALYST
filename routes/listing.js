const express = require('express');
const router = express.Router();
const { isAuthenticated, getPetitionsByCategory } = require('../controllers/ListingController');

router.get('/listing/:category', isAuthenticated, getPetitionsByCategory);

module.exports = router;
