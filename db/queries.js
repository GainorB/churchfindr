var db = require('../db/config');
const church = require('../church/church');
var twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// ADD PLACES TO DATABASE
function newChurch(req, res, next){
    church.getChurch(req.body.city, (err, results) => {
        if(err) {
            console.log(err);
        } else {

            return db.task(t => t.batch(results.map(r => t.none('INSERT INTO churches(name, address, lat, lng, searchprofile)' + 'values($1, $2, $3, $4, $5)', [r.name, r.address, r.lat, r.lng, parseInt(req.user.id)]))))
                     .then(data => { res.redirect('/'); })
                     .catch(err => { return next(err); });
        };
    });
}

// GET ALL CHURCHES
function getChurches(req, res, next){

    if(typeof (req.user) !== "undefined"){

        var userID = parseInt(req.user.id);
        
        db.any('SELECT * FROM churches WHERE searchprofile = $1', userID)
        .then(data => {
            res.render('index', {data})
        })
        .catch(err => {
            return next(err);
        });

    } else {

        db.any('SELECT * FROM churches')
        .then(data => {
            res.render('index', {data})
        })
        .catch(err => {
            return next(err);
        });

    }
}

// GET ALL CHURCHES API
function getChurchesAPI(req, res, next){

    var id = parseInt(req.body.id);
    
    db.any('SELECT name, address, lat, lng FROM churches where searchprofile = $1', id)
    .then(data => {
        res.status(200).json({data});
    })
    .catch(err => {
        return next(err);
    });
}

// DELETE A CHURCH
function deleteChurch(id, req, res, next){
    var churchID = parseInt(id);

    db.result('DELETE FROM churches where id = $1 AND searchprofile = $2', [churchID, req.user.id])
        .then(data => {
            req.flash('success', "Church deleted from your profile");
            res.redirect('/');
        })
        .catch(err => {
            return next(err);
        });
}

// LEAVE A REVIEW
function reviewChurch(req, res, next){

    db.none('UPDATE churches SET review = $1 WHERE id = $2 AND profile = $3', [req.body.review, req.body.id, req.user.id])
        .catch(err => {
            return next(err);
        });
}

/*
* SAVE TO PROFILE
*/

// SAVE CHURCH TO PROFILE
function saveChurchToProfile(id, req, res, next){
    var churchID = parseInt(id);
    var userID = parseInt(req.user.id);

    db.none('UPDATE churches SET profile = $1 WHERE id = $2', [userID, churchID])
        .then(data => {
            req.flash('success', "Church saved to your profile");
            res.redirect('/');
        })
        .catch(err => {
            return next(err);
        });
}

//GET CHURCHES SAVED TO PROFILE
function getSavedChurchesFromProfile(req, res, next){
    var userID = parseInt(req.user.id);

        db.any('SELECT churches.id, churches.name, churches.address, churches.review FROM churches JOIN users ON churches.profile = users.id WHERE users.id = $1', userID)
        .then(data => {
            res.render('users', { data: data })
        })
        .catch(err => {
            return next(err);
        });
}

// SEND SMS
function sendSMS(id, req, res, next){

    db.any('SELECT name, address FROM churches WHERE id = $1', id)
        .then(data => {

            let churchName = data[0].name;
            let address = data[0].address;

            req.flash('info', `Check your phone, text message with ${churchName} and ${address} sent to ${req.user.phonenumber}`);
            res.redirect('/users');

            client.messages.create({
            body: `Thanks for using Good News, the address you requested: ${churchName} @ ${address}.`,
            to: `${req.user.phonenumber}`,  // Text this number
            from: `${process.env.TWILIO_PHONENUMBER}` // From a valid Twilio number
                }).then(message => console.log(message.sid));

        })
        .catch(err => {
            return next(err);
        });
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