const HomeData = require("../json/home.json");
const petitionsData = require("../json/petitions.json"); // Static JSON fallback
const Petition = require("../database/models/petition.js"); // Uncomment when using database

const home = async (req, res) => {
  try {
    // Example dynamic data (you can replace these with actual database queries or calculated values)
    const users_counts = 250;  // Example value for active users
    const sign_counts = 100;   // Example value for total signs
    const petition_counts = 50; // Example value for total petitions

    // Fetch featured petitions from the database
    let featuredPetitions = await Petition.find({})
      .sort({ supporters: -1 }) // Sort by number of supporters, descending
      .limit(3);                // Limit to the top 3 petitions

    // Fallback to static JSON data if the database query fails or returns no data
    if (!featuredPetitions || featuredPetitions.length === 0) {
      featuredPetitions = petitionsData;
    }

    // Merge all data into the home object
    const home = {
      username: req.session.username,
      account: req.session.email,
      featuredPetitions,
      users_counts,
      sign_counts,
      petition_counts,
      ...HomeData, // Merge with static data from home.json
    };

    // Render the home page and pass the home object with dynamic and static data
    res.render("home", home);
  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Fallback response if an error occurs
    const home = {
      username: req.session.username,
      account: req.session.email,
      featuredPetitions: petitionsData, // Fallback to static JSON
      users_counts: 0,  // Default fallback values
      sign_counts: 0,
      petition_counts: 0,
      ...HomeData,
    };

    res.render("home", home);
  }
};

module.exports = {
  home,
};
