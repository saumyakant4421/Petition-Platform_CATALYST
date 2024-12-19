const { Petition } = require("../database/models/AccountModel.js");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('#account-section'); // Redirect to login page if not logged in
    }
    next();
};

// Controller to get petitions by category
const getPetitionsByCategory = async (req, res) => {
    try {
        console.log("Route reached"); // Debugging log
        const category = req.params.category; // Category from URL
        const { sort } = req.query; // Get sort order from query params
        console.log("Route reached"); // Debugging log

        let petitions = await Petition.find({ category: category });

        // Apply sorting based on query
        if (sort === "newest") {
            petitions.sort((a, b) => b.createdAt - a.createdAt);
        } else if (sort === "oldest") {
            petitions.sort((a, b) => a.createdAt - b.createdAt);
        } else if (sort === "supporters") {
            petitions.sort((a, b) => b.supporters.length - a.supporters.length);
        }

        // Render the petitions page
        res.render('listing', {
            petitions: petitions,
            category: category,
            user: req.session.account,
        });
    } catch (err) {
        console.error("Error fetching petitions by category:", err.message);
        res.render('creation/error', {
            errorMessage: "An error occurred while fetching petitions.",
        });
    }
};

module.exports = {
    isAuthenticated, // Export middleware
    getPetitionsByCategory, // Export controller
};
