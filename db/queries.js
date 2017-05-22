var db = require('../db/config');
const church = require('../church/church');
var twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// ADD PLACES TO DATABASE
function newChurch(req, res, next){
    church.getChurch(req.body.city, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(results);
            //console.log("User ID "+ parseInt(req.user.id));
            return db.task(t=>t.batch(results.map(r=>t.none('INSERT INTO churches(name, address, lat, lng, searchprofile)' + 'values($1, $2, $3, $4, $5)', [r.name, r.address, r.lat, r.lng, parseInt(req.user.id)]))))
                     .then(function(data){ res.redirect('/'); })
                     .catch(function(err){ return next(err); });
        };
    });
}

// GET ALL CHURCHES
function getChurches(req, res, next){

    if(typeof (req.user) !== "undefined"){
        var userID = parseInt(req.user.id);
        
        db.any('SELECT * FROM churches WHERE searchprofile = $1', userID)
        .then(function(data){
            res.render('index', {data})
        })
        .catch(function(err) {
            return next(err);
        });
    } else {
        db.any('SELECT * FROM churches')
        .then(function(data){
            res.render('index', {data})
        })
        .catch(function(err) {
            return next(err);
        });
    }
}

// GET ALL CHURCHES API
function getChurchesAPI(req, res, next){

    if(typeof (req.user) !== "undefined"){
        var userID = parseInt(req.user.id);
        
        db.any('SELECT name, address, lat, lng FROM churches where searchprofile = $1', userID)
        .then(function(data){
            res.status(200).json({data});
        })
        .catch(function(err) {
            return next(err);
        });
    } else {
        db.any('SELECT * FROM churches')
        .then(function(data){
            res.status(200).json({data});
        })
        .catch(function(err) {
            return next(err);
        });
    }
}

// DELETE A CHURCH
function deleteChurch(req, res, next){
    var churchID = parseInt(req.params.id);

    db.result('DELETE FROM churches where id = $1', churchID)
        .catch(function(err) {
            return next(err);
        });
}

// LEAVE A REVIEW
function reviewChurch(req, res, next){
    var churchID = parseInt(req.params.id);

    db.none('UPDATE churches SET review = $1 WHERE id = $2', [req.body.review, churchID])
        .catch(function(err) {
            return next(err);
        });
}

/*
* SAVE TO PROFILE
*/

// SAVE CHURCH TO PROFILE
function saveChurchToProfile(req, res, next){
    var churchID = parseInt(req.params.id);
    var userID = parseInt(req.user.id);

    console.log("Who's logged in? " + req.user.username);
    console.log("Get logged in ID number: " + userID);

    db.none('UPDATE churches SET profile = $1 WHERE id = $2', [userID, churchID])
        .catch(function(err) {
            return next(err);
        });
}

//GET CHURCHES SAVED TO PROFILE
function getSavedChurchesFromProfile(req, res, next){
    var userID = parseInt(req.user.id);

        db.any('SELECT churches.id, churches.name, churches.address, churches.review FROM churches JOIN users ON churches.profile = users.id WHERE users.id = $1', userID)
        .then(function(data){
            res.render('users', { data: data })
        })
        .catch(function(err) {
            return next(err);
        });
}

// SEND SMS
function sendSMS(req, res, next){
    var number = parseInt(req.user.phonenumber);
    console.log(number);
    var address = req.body.address;
    console.log(address);

    client.messages.create({
    body: `Thanks for using Good News, the address you requested: ${address}.`,
    to: `${number}`,  // Text this number
    from: `${process.env.TWILIO_PHONENUMBER}` // From a valid Twilio number
        }).then((message) => console.log(message.sid));
}

// EXPORT MODULES TO BE USED IN ROUTING
module.exports = {
    newChurch, // CREATE
    getChurches, // READ
    deleteChurch, // DELETE
    reviewChurch, // UPDATE
    saveChurchToProfile, // UPDATE
    getSavedChurchesFromProfile, // READ
    sendSMS,
    getChurchesAPI,
};