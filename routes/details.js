const express = require("express");
const router = express.Router();
const { getPetitionById, signPetition } = require("../controllers/DetailsController.js");
const { isAuthenticated } = require("../middlewares/authMiddleware.js"); // Import the middleware

// Route to fetch petition details
router.get("/:id", isAuthenticated, getPetitionById);

// Route to sign a petition (requires authentication)
router.post("/:id/sign", isAuthenticated, signPetition);

module.exports = router;
