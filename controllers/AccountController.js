const AccountManager = require("../database/AccountManager.js");

const create = async (req, res) => {
  const result = await AccountManager.CreateAccount(req.body, req);
  if (result.success) {
    res.redirect("/");
  } else {
    res.redirect(`/error?message=${encodeURIComponent(result.message)}`);
  }
};

const login = async (req, res) => {
  const result = await AccountManager.LoginAccount(req.body, req);
  if (result.success) {
    res.redirect("/");
  } else {
    res.redirect(`/error?message=${encodeURIComponent(result.message)}`);
  }
};

module.exports = {
  create,
  login,
};
