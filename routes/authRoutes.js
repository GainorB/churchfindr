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

router.post('/register', (req, res, next)  => {
   
  // IDENTITY
  var username = req.body.username;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;

  // PASSWORD
  var password = req.body.password;
  var password2 = req.body.password2;

  // ADDRESS
  var street = req.body.street;
  var zipcode = req.body.zipcode;
  var city = req.body.city;
  var state = req.body.state;
  var country = req.body.country;

  // VALIDATION
  req.checkBody('username', 'User Name is required').notEmpty();
  req.checkBody('firstname', 'First Name is required').notEmpty();
  req.checkBody('lastname', 'Last Name is required').notEmpty();
  req.checkBody('email', 'Email is required').isEmail();

  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(password);

  req.checkBody('street', 'Street is required').notEmpty();
  req.checkBody('zipcode', 'Zip Code is required').isInt();
  req.checkBody('city', 'City is required').notEmpty();
  req.checkBody('state', 'State is required').notEmpty();
  req.checkBody('country', 'Country is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('auth/register', { errors: errors });
  } else {
    authHelpers.createNewUser(req, res).then((user) => {
        req.login(user, (err) => {
      
        if(err) return next(err);

        res.redirect('/users');
      });
    }).catch((err) => { res.status(500).json({ status: 'Registration Error: Username/Email already used.' }); });
  }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/auth/login',
    failureFlash: true
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;