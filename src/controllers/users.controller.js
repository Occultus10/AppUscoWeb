const usersCtrl = {};

// Models
const User = require('../models/User');

// Modules
const passport = require("passport");


usersCtrl.renderSignUpForm = (req, res) => {
  res.render('users/signup');
};


usersCtrl.renderSigninForm = (req, res) => {
  res.render("users/signin");
};

usersCtrl.signin = passport.authenticate("local", {
  successRedirect: "/visitas/visitas",
  failureRedirect: "/users/signin",
  failureFlash: true
});

usersCtrl.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "Has cerrado sesión.");
  res.redirect("/users/signin");
};

module.exports = usersCtrl;