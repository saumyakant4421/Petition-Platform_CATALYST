const HomeData = require("../json/home.json");
const { Petition, Account } = require("../database/models/AccountModel.js");
const { bucket } = require("../firebase");

exports.startPetition = (req, res) => {
    const categories = HomeData.templates;
    const icons = HomeData.icons;

    res.render('creation', {
        templates: categories,
        icons: icons,
        user: req.session.account
    });
};

exports.createPetition = async (req, res) => {
    try {
        console.log(req.body); // Debugging form data

        const {
            title,
            description,
            category,
            petition_to,
            petition_by,
            petition_date,
            location,
            targetSupporters,
        } = req.body;

        // Check if user is logged in
        if (!req.session.userId) {
            return res.status(401).render('creation/error', {
                errorMessage: "Unauthorized: Please log in to create a petition."
            });
        }

        // Validate required fields
        if (!title || !description || !category || !petition_to || !petition_by || !petition_date || !location || !targetSupporters) {
            return res.status(400).render('creation/error', {
                errorMessage: "All fields are required."
            });
        }

        // Convert target entities to an array
        const petitionToArray = petition_to
            .split(",")
            .map(entity => entity.trim());

        // Default image URL
        let imageUrl = "";

        // Handle image upload if file exists
        if (req.file) {
            const file = bucket.file(`petitions/${Date.now()}_${req.file.originalname}`);
            const stream = file.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            await new Promise((resolve, reject) => {
                stream.on('error', (err) => {
                    console.error("Error uploading image to Firebase:", err.message);
                    reject(new Error("Image upload failed."));
                });

                stream.on('finish', async () => {
                    try {
                        await file.makePublic();
                        imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
                        resolve();
                    } catch (err) {
                        reject(new Error("Error making image public."));
                    }
                });

                stream.end(req.file.buffer);
            });
        }

        // Prepare petition object
        const newPetition = {
            title,
            description,
            location,
            category: Array.isArray(category) ? category : [category],
            scope: req.body.scope || "Local",
            authors: [petition_by],
            targetEntities: petitionToArray,
            createdAt: new Date(),
            targetSupporters: targetSupporters,
            creatorId: req.session.userId,
            supporters: [],
            image: imageUrl, // Set image URL
        };

        // Save petition to database
        const petition = new Petition(newPetition);
        await petition.save();

        // Link petition to creator's account
        await Account.findByIdAndUpdate(
            req.session.userId,
            { $push: { createdPetitions: petition._id } }
        );

        console.log("Petition Created Successfully:", petition);

        // Render the success page
        res.render('creation/success', {
            message: "Petition created successfully!",
        });
    } catch (err) {
        console.error("Error occurred during petition creation:", err.message);

        // Render the error page
        res.render('creation/error', {
            errorMessage: err.message || "An unexpected error occurred."
        });
    }
};
