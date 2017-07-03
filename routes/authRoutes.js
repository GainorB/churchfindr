const express = require('express');
const router = express.Router();
const passport = require('../services/auth/local');
const authHelpers = require('../services/auth/auth-helpers');
var errors;

router.get('/login', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/login');
});

router.get('/register', authHelpers.loginRedirect, (req, res) => {
  res.render('auth/register', { errors: errors });
});

router.post('/register', (req, res, next) => {

  const { username, firstname, lastname, email, phonenumber, password, street, zipcode, city, state, country } = req.body;

  // VALIDATION
  req.checkBody('username', 'User Name is required.').notEmpty();
  req.checkBody('firstname', 'First Name is required.').notEmpty();
  req.checkBody('lastname', 'Last Name is required.').notEmpty();
  req.checkBody('email', 'Email is required.').isEmail();
  req.checkBody('phonenumber', 'Phone Number is required, only 10 digits.').isInt().len(10, 10);

  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(password);

  req.checkBody('street', 'Street is required.').notEmpty();
  req.checkBody('zipcode', 'Zip Code is required, only 5 digits.').isInt().len(5, 5);
  req.checkBody('city', 'City is required.').notEmpty();
  req.checkBody('state', 'State is required.').notEmpty();
  req.checkBody('country', 'Country is required.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', "There was a problem during registration, please fix the errors below:");
    res.render('auth/register', { errors: errors });
  } else {

    authHelpers.createNewUser(req, res).then((user) => {

      req.login(user, (err) => {

        if (err) return next(err);

        res.redirect('/users');
      });

    }).catch((err) => {
      console.log(err);
      if (err.detail.includes("email")) {
        req.flash('error', `Registration Error: Email already in use.`);
        res.redirect('register');
      } else if (err.detail.includes("username")) {
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