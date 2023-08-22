// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();

let getHomePage = (req, res) => {
  return res.render("homepage.ejs");
};

export default {
  getHomePage,
};
