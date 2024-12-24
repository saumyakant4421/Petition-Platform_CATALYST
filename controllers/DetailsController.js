const { Petition, Account } = require("../database/models/AccountModel.js");

/**
 * Get a petition by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPetitionById = async (req, res) => {
    try {
        const petitionId = req.params.id;

        if (!petitionId) {
            return res.status(400).render("creation/error", {
                errorMessage: "Invalid Petition ID",
            });
        }

        const petition = await Petition.findById(petitionId).populate("supporters.userId", "username email");

        if (!petition) {
            return res.status(404).render("creation/error", {
                errorMessage: "Petition not found",
            });
        }

        // Pass petition and user data to EJS
        res.render("details", {
            petition,
            user: req.session.account || null,
        });
    } catch (err) {
        console.error("Error fetching petition by ID:", err.message);
        res.status(500).render("creation/error", {
            errorMessage: "An error occurred while fetching the petition.",
        });
    }
};


/**
 * Sign a petition
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signPetition = async (req, res) => {
    try {
        const petitionId = req.params.id;
        const userId = req.session.userId;

        // Ensure the user is logged in
        if (!userId) {
            return res.status(401).json({ error: "You must be logged in to sign this petition." });
        }

        // Fetch the petition
        const petition = await Petition.findById(petitionId);
        if (!petition) {
            return res.status(404).json({ error: "Petition not found." });
        }

        // Check if the user has already signed the petition
        const alreadySigned = petition.supporters.some(supporter => supporter.userId.toString() === userId);
        if (alreadySigned) {
            return res.status(400).json({ message: "You have already signed this petition." });
        }

        // Add the user to the supporters list
        petition.supporters.push({ userId, signedAt: new Date() });
        await petition.save();

        // Update the user's signed petitions list
        await Account.findByIdAndUpdate(userId, { $push: { signedPetitions: petitionId } });

        res.status(200).json({ message: "Thank you for signing the petition!" });
    } catch (err) {
        console.error("Error signing petition:", err.message);
        res.status(500).json({ error: "An error occurred while signing the petition." });
    }
};


module.exports = {
    getPetitionById,
    signPetition,
};
