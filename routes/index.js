var express = require('express');
var router = express.Router();
var db = require('../db/queries');

// GET FROM DATABASE
router.get('/', db.getChurches);

// POST TO DATABASE
router.post('/', db.newChurch);

// DELETE FROM DATABASE
router.delete('/:id', db.deleteChurch);

/*
* SAVING CHURCHES
*/

// PATCH
router.patch('/saved/:id', db.saveChurch);

// GET
router.get('/saved', db.getSavedChurches);

/*
* REVIEW CHURCHES
*/

// PATCH
router.patch('/reviews/:id', db.reviewChurch);

/*
* SAVE TO PROFILE
*/
router.patch('/savetoprofile/:id', db.saveChurchToProfile);

module.exports = router;