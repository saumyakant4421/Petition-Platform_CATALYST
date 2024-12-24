const { Account } = require("../database/models/AccountModel.js");

const isAuthenticated = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: "You must be logged in to perform this action." });
        }

        // Check if user details are already stored in session
        if (!req.session.account) {
            const account = await Account.findById(req.session.userId);
            if (!account) {
                req.session.destroy(); // Destroy invalid session
                return res.status(401).json({ error: "Session expired. Please log in again." });
            }
            req.session.account = account; // Save user details in session
        }

        // Attach user details to the request object for convenience
        req.user = req.session.account;

        next();
    } catch (err) {
        console.error("Authentication error:", err.message);
        res.status(500).json({ error: "Authentication error. Please try again later." });
    }
};


module.exports = { isAuthenticated };
