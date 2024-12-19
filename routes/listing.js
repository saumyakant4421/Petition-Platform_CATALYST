const express = require("express");
const router = express.Router();
const ListingController = require("../controllers/ListingController.js");

// Use isAuthenticated middleware from the controller
router.get("/listing/:category", ListingController.isAuthenticated, ListingController.getPetitionsByCategory);

module.exports = router;
