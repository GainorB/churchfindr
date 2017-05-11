var db = require('../db/config');
const church = require('../church/church');

// ADD PLACES TO DATABASE
function newChurch(req, res, next){
    church.getChurch(req.body.city, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            console.log("User ID "+ parseInt(req.user.id));
            return db.task(t=>t.batch(results.map(r=>t.none('INSERT INTO churches(name, address, searchprofile)' + 'values($1, $2, $3)', [r.name, r.address, parseInt(req.user.id)]))))
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
            res.render('index', { data: data })
        })
        .catch(function(err) {
            return next(err);
        });
    } else {
        db.any('SELECT * FROM churches')
        .then(function(data){
            res.render('index', { data: data })
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

// EXPORT MODULES TO BE USED IN ROUTING
module.exports = {
    newChurch: newChurch, // CREATE
    getChurches: getChurches, // READ
    deleteChurch: deleteChurch, // DELETE
    reviewChurch: reviewChurch, // UPDATE
    saveChurchToProfile: saveChurchToProfile, // UPDATE
    getSavedChurchesFromProfile: getSavedChurchesFromProfile, // READ
};