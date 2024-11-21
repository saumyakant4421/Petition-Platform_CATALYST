const HomeData = require("../json/home.json");

const home = (req, res) => {
  const home = {
    username: req.session.username,
    account: req.session.email,
    ...HomeData,
  };

  res.render("home", home);
};

module.exports = {
  home,
};
