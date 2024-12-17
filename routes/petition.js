const express = require('express');
const router = express.Router();
const petitionController = require('../controllers/PetitionController');

// Route: Render Start Petition Page
router.get('/start', petitionController.startPetition);

// Route: Render Creation Page (linked to startPetition to pass categories)
router.get('/creation', petitionController.startPetition);

// Route: Handle Petition Submission
router.post('/create', petitionController.createPetition);

// Success Page Route (placeholder for now)
router.get('/success', (req, res) => {
    res.send("Petition created successfully!"); // Replace with a success EJS view
});

module.exports = router;
