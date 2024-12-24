const HomeData = require("../json/home.json");
const petitionsData = require("../json/petitions.json"); // Static JSON fallback
const { Petition } = require("../database/models/AccountModel.js"); // Uncomment when using the database
const footerData = require("../json/footer.json");

const home = async (req, res) => {
  try {
    // Example counts for display
    const users_counts = 250; 
    const sign_counts = 100;
    const petition_counts = 50;

    // Fetch featured petitions from the database
    let featuredPetitions = await Petition.find({})
      .sort({ supporters: -1 })
      .limit(3);

    if (!featuredPetitions || featuredPetitions.length === 0) {
      featuredPetitions = petitionsData; // Fallback to static data
    }

    // Fetch user-created petitions if userId exists
    let userPetitions = [];
    if (req.session.userId) {
      userPetitions = await Petition.find({ creatorId: req.session.userId });
    }

    // Construct data for the home view
    const data = {
      username: req.session.username,
      account: req.session.email,
      header: HomeData.header, // Include header data
      templates: HomeData.templates, // Add templates for categories
      featuredPetitions,
      userPetitions,
      users_counts,
      sign_counts,
      petition_counts,
      footerData,
    };

    // Render the home page
    res.render("home", data);
  } catch (error) {

    // Fallback data in case of error
    const fallbackData = {
      username: req.session.username || "Guest",
      account: req.session.email || "",
      header: HomeData.header,
      templates: HomeData.templates,
      featuredPetitions: petitionsData, // Fallback to static JSON
      userPetitions: [],
      users_counts: 0,
      sign_counts: 0,
      petition_counts: 0,
      footerData,
    };

    res.render("home", fallbackData);
  }
};

module.exports = {
  home,
};
