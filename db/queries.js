var db = require('../db/config');
const church = require('../church/church')

// ADD PLACES TO DATABASE
function newChurch(req, res, next){
    church.getChurch(req.body.city, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            return db.task(t=>t.batch(results.map(r=>t.none('INSERT INTO churches(name, address)' + 'values($1, $2)', [r.name, r.address]))))
                     .then(function(data){ res.redirect('/'); })
                     .catch(function(err){ return next(err); });
        };
    });
}

// GET ALL CHURCHES
function getChurches(req, res, next){
    db.any('SELECT * FROM churches')
        .then(function(data){
            res.render('index', { title: "Churches", data: data })
        })
        .catch(function(err) {
            return next(err);
        });
}

// DELETE A CHURCH
function deleteChurch(req, res, next){
    var churchID = parseInt(req.params.id);

    db.result('DELETE FROM churches where id = $1', churchID)
        .catch(function(err) {
            return next(err);
        });
}

// SAVE A CHURCH
function saveChurch(req, res, next){
    var churchID = parseInt(req.params.id);
    console.log(req.user);
    console.log(req.user.id);

    db.none('UPDATE churches SET saved = true WHERE id = $1', churchID)
        .catch(function(err) {
            return next(err);
        });
}

// GET SAVED CHURCHES
function getSavedChurches(req, res, next){
    db.any('SELECT * FROM churches WHERE saved = true')
        .then(function(data){
            res.render('saved', { title: "Saved Churches", data: data })
        })
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

// SAVE CHURCH TO PROFILE
function saveChurchToProfile(req, res, next){
    var churchID = parseInt(req.params.id);
    console.log(req.user);
    console.log(req.user.id);

    db.none('UPDATE churches SET savedtoprofile = $1 WHERE id = $2', [req.user.id, churchID])
        .catch(function(err) {
            return next(err);
        });
}

//GET CHURCHES SAVED TO PROFILE
function getSavedChurchesFromProfile(req, res, next){
    db.any('SELECT * FROM churches WHERE savedtoprofile = $1', req.user.id)
        .then(function(data){
            res.render('users', { title: "Churches Saved To Profile", data: data })
        })
        .catch(function(err) {
            return next(err);
        });
}

// EXPORT MODULES TO BE USED IN ROUTING
module.exports = {
    newChurch: newChurch,
    getChurches: getChurches,
    deleteChurch: deleteChurch,
    saveChurch: saveChurch,
    getSavedChurches: getSavedChurches,
    reviewChurch: reviewChurch,
    saveChurchToProfile: saveChurchToProfile,
    getSavedChurchesFromProfile: getSavedChurchesFromProfile
};