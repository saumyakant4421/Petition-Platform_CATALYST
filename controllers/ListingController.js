const { Petition } = require("../database/models/AccountModel.js");

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/#account-section'); // Redirect to login page if not logged in
    }
    next();
};

// Controller to get petitions by category
const getPetitionsByCategory = async (req, res) => {
    try {
        const category = req.params.category; // Category from URL
        const { sort } = req.query; // Sort order from query params

        // Sanitize category
        const sanitizedCategory = category.replace(/[^a-zA-Z0-9\s]/g, "");

        // Build Mongoose query with sorting
        let sortQuery = {};
        if (sort === "newest") sortQuery = { createdAt: -1 };
        else if (sort === "oldest") sortQuery = { createdAt: 1 };
        else if (sort === "supporters") sortQuery = { "supporters.length": -1 };

        // Fetch petitions
        const petitions = await Petition.find({ category: sanitizedCategory }).sort(sortQuery);

        // Check if it's an AJAX request
        if (req.xhr) {
            return res.json({ petitions });
        }

        // Render the listing page
        res.render("listing", {
            petitions: petitions,
            category: sanitizedCategory,
            user: req.session.account,
        });
    } catch (err) {
        console.error("Error fetching petitions by category:", err.message);
        if (req.xhr) {
            return res.status(500).json({ error: "Failed to fetch petitions." });
        }
        res.status(500).render("creation/error", {
            errorMessage: "An error occurred while fetching petitions.",
        });
    }
};


module.exports = {
    isAuthenticated,
    getPetitionsByCategory,
};
