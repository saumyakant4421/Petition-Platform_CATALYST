const HomeData = require("../json/home.json");
const petitionsData = require("../json/petitions.json"); // Static JSON fallback
const {Petition} = require("../database/models/AccountModel.js"); // Uncomment when using database
const footerData = require("../json/footer.json");

const home = async (req, res) => {
  try {
    const users_counts = 250;  // Example value for active users
    const sign_counts = 100;   // Example value for total signs
    const petition_counts = 50; // Example value for total petitions

    // Fetch featured petitions from the database
    let featuredPetitions = await Petition.find({})
      .sort({ supporters: -1 })
      .limit(3);

    // Fallback to static JSON data if the database query fails or returns no data
    if (!featuredPetitions || featuredPetitions.length === 0) {
      featuredPetitions = petitionsData;
    }

    const home = {
      username: req.session.username,
      account: req.session.email,
      featuredPetitions,
      userPetitions, // Include user-created petitions
      users_counts,
      sign_counts,
      petition_counts,
      footerData, // Include footer data
      ...HomeData,
    };

    res.render("home", home);
  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Fallback response if an error occurs
    const home = {
      username: req.session.username,
      account: req.session.email,
      featuredPetitions: petitionsData, // Fallback to static JSON
      userPetitions: [],
      users_counts: 0,
      sign_counts: 0,
      petition_counts: 0,
      footerData, // Include footer data
      ...HomeData,
    };

    res.render("home", home);
  }
};

module.exports = {
  home,
};
