const express = require('express');
const router = express.Router();
const petitionController = require('../controllers/PetitionController');

const multer = require('multer'); // Import multer
const path = require('path'); // To handle file extensions and directories

// Set up storage configuration for multer
const storage = multer.memoryStorage(); // Store file in memory for now

// Initialize multer with the storage configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Optional: limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true); // Accept the file
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

// Route: Render Start Petition Page
router.get('/start', petitionController.startPetition);

// Route: Render Creation Page (linked to startPetition to pass categories)
router.get('/creation', petitionController.startPetition);

// Route: Handle Petition Submission
router.post('/create',upload.single('image'), petitionController.createPetition);

// Success Page Route (placeholder for now)
router.get('/success', (req, res) => {
    res.send("Petition created successfully!"); // Replace with a success EJS view
});

module.exports = router;
