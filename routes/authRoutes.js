const express = require('express');
const router = express.Router();
const passport = require('../services/auth/local');
const authHelpers = require('../services/auth/auth-helpers');
var errors;

router.get('/login', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/login');
});

router.get('/register', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/register', { errors });
});

router.post('/register', (req, res, next) => {

  const { username, phonenumber, password } = req.body;

  // VALIDATION
  req.checkBody('username', 'User Name is required.').notEmpty();
  req.checkBody('phonenumber', 'Phone Number is required, only 10 digits.').len(10, 10);

  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', "There was a problem during registration, please fix the errors below:");
    res.render('auth/register', { errors });
  } else {

    authHelpers.createNewUser(req, res).then((user) => {

      req.login(user, (err) => {

        if (err) return next(err);

        res.redirect('/users');
      });

    }).catch((err) => {
      console.log(err);
      if (err.detail.includes("username")) {
        req.flash('error', `Registration Error: Username already in use.`);
        res.redirect('register');
      }
    });
  }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid Username or Password.'
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', "You're now logged out.");
  res.redirect('/auth/login');
});

module.exports = router;