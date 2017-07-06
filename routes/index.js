var express = require('express');
var router = express.Router();
var db = require('../db/queries');
const authHelpers = require('../services/auth/auth-helpers');

// GET FROM DATABASE
router.get('/', db.getChurches);

// API FOR GETTING LAT AND LNG TO RENDER THE GOOGLE MAP
router.patch('/api/churches', db.getChurchesAPI);

// POST TO DATABASE
router.post('/', authHelpers.loginRequired, db.newChurch);

// DELETE FROM DATABASE
router.get('/profile/delete/:id', authHelpers.loginRequired, (req, res, next) => {
    let id = req.params.id;
    db.deleteChurch(id, req, res, next);
});

// REVIEWS ROUTE
router.get('/reviews', authHelpers.loginRequired, db.getReviews);

// SAVE A REVIEWED CHURCH TO PROFILE
router.get('/profile/reviews/save/:id', authHelpers.loginRequired, (req, res, next) => {
    let id = req.params.id;
    db.saveReviewedChurchToProfile(id, req, res, next);
});

/*
* REVIEW CHURCHES
*/

// PATCH
router.patch('/profile/review/:id', authHelpers.loginRequired, db.reviewChurch);

/*
* SAVE TO PROFILE
*/
router.get('/profile/save/:id', authHelpers.loginRequired, (req, res, next) => {
    let id = req.params.id;
    db.saveChurchToProfile(id, req, res, next);
});

/*
* SMS
*/

router.get('/profile/sms/:id', authHelpers.loginRequired, (req, res, next) => {
    let id = req.params.id;
    db.sendSMS(id, req, res, next);
});

module.exports = router;