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

            return db.task(t => t.batch(results.map(r => t.none('INSERT INTO churches(name, address, lat, lng, search_profile)' + 'values($1, $2, $3, $4, $5)', [r.name, r.address, r.lat, r.lng, parseInt(req.user.id)]))))
                     .then(data => { res.redirect('/'); })
                     .catch(err => { return next(err); });
        };
    });
}

// GET ALL CHURCHES
function getChurches(req, res, next){

    if(typeof (req.user) !== "undefined"){
        
        db.tx(t => {

                return t.batch([
                    // TOTAL SEARCH RESULTS 
                    t.any(`SELECT COUNT(*) AS search_stats FROM churches WHERE visible = TRUE AND search_profile = $1`, req.user.id),
                    // GET ALL CHURCHES
                    t.any(`SELECT * FROM churches WHERE visible = TRUE AND search_profile = $1`, req.user.id)
                ]);
            })
            .then(data => {

                let churches = data[1].map(element => { return element; });
                let search_stats = data[0][0].search_stats;
                
                res.render('index', { churches, search_stats });
            })
            .catch(err => {
                return next(err);
            });

    } else {

        db.tx(t => {

                return t.batch([
                    // TOTAL SEARCH RESULTS 
                    t.any(`SELECT COUNT(*) AS search_stats FROM churches WHERE visible = TRUE`),
                    // GET ALL CHURCHES
                    t.any(`SELECT * FROM churches WHERE visible = TRUE`)
                ]);
            })
            .then(data => {

                let churches = data[1].map(element => { return element; });
                let search_stats = data[0][0].search_stats;
                
                res.render('index', { churches, search_stats });
            })
            .catch(err => {
                return next(err);
            });

    }
}

// GET ALL CHURCHES API
function getChurchesAPI(req, res, next){

    var id = parseInt(req.body.id);
    
    db.any(`SELECT name, address, lat, lng FROM churches WHERE visible = TRUE AND search_profile = $1 ORDER BY name ASC`, id)
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

    db.result('DELETE FROM churches where id = $1 AND search_profile = $2', [churchID, req.user.id])
        .then(data => {
            req.flash('success', "Church deleted from your profile");
            res.redirect('/');
        })
        .catch(err => {
            return next(err);
        });
}

// DELETE ALL CHURCHES
function deleteAllChurches(req, res, next){

    db.result('DELETE FROM churches where search_profile = $2', req.user.id)
        .then(data => {
            req.flash('success', "All churches deleted from your profile");
            res.redirect('/');
        })
        .catch(err => {
            return next(err);
        });
}

// LEAVE A REVIEW
function reviewChurch(req, res, next){

    db.none('UPDATE churches SET review = $1, review_date = now() WHERE id = $2 AND search_profile = $3', [req.body.review, req.body.id, req.user.id])
        .catch(err => {
            return next(err);
        });
}

// GET REVIEWS
function getReviews(req, res, next){
    db.tx(t => {

            return t.batch([
                // TOTAL REVIEWS IN DATABASE
                t.any(`SELECT COUNT(*) AS review_stats FROM churches WHERE review != 'null'`),
                // GET ALL CHURCHES WITH REVIEWS
                t.any(`SELECT users.username, COALESCE(to_char(review_date, 'Dy Mon DD'), '') AS review_date, churches.id, churches.saved_profile, churches.name, churches.address, churches.review FROM churches
                       INNER JOIN users on churches.saved_profile = users.id
                       WHERE churches.review != 'null' ORDER BY churches.name ASC`)
            ]);
        })
        .then(data => {

            let review_stats = data[0][0].review_stats;
            let reviews = data[1].map(element => {
                return element;
            });

            res.render('reviews', { review_stats, reviews });

        })
        .catch(err => {
            console.error(err);
        })
}

/*
* SAVE TO PROFILE
*/

// SAVE CHURCH TO PROFILE
function saveChurchToProfile(id, req, res, next){
    var churchID = parseInt(id);
    var userID = parseInt(req.user.id);

    db.any(`SELECT name FROM churches WHERE id = $1`, churchID)
        .then(data => {

            let name = data[0].name;

            db.any(`SELECT name FROM churches WHERE saved_profile = $1`, userID)
                .then(data => {

                    let names = data.map(element => {
                        return element.name;
                    })

                    if(names.includes(name)){
                        req.flash('error', "You can't save a church you already saved");
                        res.redirect('/');
                    } else {

                        db.none(`UPDATE churches SET visible = FALSE, saved_profile = $1 WHERE id = $2`, [userID, churchID])
                            .then(data => {
                                req.flash('success', "Church saved to your profile");
                                res.redirect('/');
                            })
                            .catch(err => {
                                return next(err);
                            });
                    }
                })
                .catch(err => {
                    console.error(err);
                })
        })
        .catch(err => {
            console.error(err);
        })
}

//GET CHURCHES SAVED TO PROFILE
function getSavedChurchesFromProfile(req, res, next){
    var userID = parseInt(req.user.id);

        db.any(`SELECT churches.id, churches.name, churches.address, churches.review FROM churches
                INNER JOIN users ON churches.saved_profile = users.id
                WHERE visible = FALSE AND users.id = $1 ORDER BY name ASC`, userID)
        .then(data => {
            res.render('users', { data });
        })
        .catch(err => {
            return next(err);
        });
}

function saveReviewedChurchToProfile(id, req, res, next){
    var churchID = parseInt(id);
    var userID = parseInt(req.user.id);

    db.any(`SELECT name FROM churches WHERE id = $1`, churchID)
        .then(data => {

            let name = data[0].name;

            db.any(`SELECT name FROM churches WHERE saved_profile = $1`, userID)
                .then(data => {

                    let names = data.map(element => {
                        return element.name;
                    })

                    if(names.includes(name)){
                        req.flash('error', "You can't save a church you already saved");
                        res.redirect('/reviews');
                    } else {

                    db.any('SELECT id, name, address, lat, lng FROM churches WHERE id = $1', churchID)
                        .then(data => {

                            db.any(`INSERT into churches(name, visible, address, lat, lng, saved_profile, search_profile)` 
                                    + `VALUES($1, $2, $3, $4, $5, $6, $7)`, [data[0].name, false, data[0].address, data[0].lat, data[0].lng, userID, userID])
                                .then(data => {
                                    req.flash('success', "Church saved to your profile");
                                    res.redirect('/users');
                                })
                                .catch(err => {
                                    return next(err);
                                });

                        })
                        .catch(err => {
                            return next(err);
                        });
                    }
                })
                .catch(err => {
                    return next(err);
                })
        })
        .catch(err => {
            return next(err);
        })
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
    getReviews,
    saveReviewedChurchToProfile
};