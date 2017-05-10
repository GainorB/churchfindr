const express = require('express');
const router = express.Router();
const authHelpers = require('../services/auth/auth-helpers');
var db = require('../db/queries');

/* GET USERS */

router.get('/', authHelpers.loginRequired, db.getSavedChurchesFromProfile, (req, res) => {
  res.render('users', {userInfo:req.user});
});

module.exports = router;