require("dotenv").config();

let getHomePage = (req, res) => {
  return res.render("homepage.ejs");
};

module.exports = {
  getHomePage,
};
