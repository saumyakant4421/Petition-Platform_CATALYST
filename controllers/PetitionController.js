const HomeData = require("../json/home.json"); // Ensure this path is correct
const {Petition, Account} = require("../database/models/AccountModel.js");

exports.startPetition = (req, res) => {
    // Access categories directly from HomeData (no need to read the file)
    const categories = HomeData.templates;
    const icons = HomeData.icons

    // Render the petition creation form with categories loaded from JSON
    res.render('creation', {
        templates: categories, // Pass categories to the template
        icons: icons,  
        user: req.session.account // Pass user data to the template
    });
};


exports.createPetition = async (req, res) => {
    try {
        console.log(req.body); // Debug: Check form data

        const {
            title,
            description,
            category,
            petition_to,
            petition_by,
            petition_date,
            location,
            targetSupporters, // Added field
        } = req.body;

        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(401).send("Unauthorized: Please log in to create a petition.");
        }

        if (!title || !description || !category || !petition_to || !petition_by || !petition_date || !location) {
            return res.status(400).send("All fields are required.");
        }

        // Prepare the new petition object
        const newPetition = {
            title,
            description,
            category: Array.isArray(category) ? category : [category],
            scope: req.body.scope || "Local", // Default to Local
            authors: [petition_by],
            targetEntities: [petition_to],
            createdAt: new Date(),
            targetSupporters: targetSupporters, // Added targetSupporters
            creatorId: req.session.userId, // Automatically assign creator ID
            supporters: [],
            image: "",
        };

        // Save petition to database
        const petition = new Petition(newPetition);
        await petition.save();

        // Link petition to creator's account
        await Account.findByIdAndUpdate(
            req.session.userId,
            { $push: { createdPetitions: petition._id } }
        );

        console.log("Petition Created:", petition);
        res.redirect('/petition/success');
    } catch (err) {
        console.error("Error occurred:", err.message);
        res.status(500).send("Internal Server Error: " + err.message);
    }
};
