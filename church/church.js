const request = require('request');

var getChurch = (city, callback) => {
    request({
        url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}&type=church&rankBy=distance&key=AIzaSyAppwgf_zKgZd66IXWEQ6wllHT0n0zEMpA`,
        json: true
    }, (err, res, body) => {
        if (err) {
            callback('Unable to connect to google API server.');            
        } else if (res.statusCode === 400) {
            callback('Unable to fetch data.');
        } else if (res.statusCode === 200) {
            callback(undefined, [{
                name: body.results[0].name,
                address: body.results[0].formatted_address
            }, {
                name: body.results[1].name,
                address: body.results[1].formatted_address
            }, {
                name: body.results[2].name,
                address: body.results[2].formatted_address
            },{
                name: body.results[3].name,
                address: body.results[3].formatted_address
            },{
                name: body.results[4].name,
                address: body.results[4].formatted_address
            },{
                name: body.results[5].name,
                address: body.results[5].formatted_address
            },{
                name: body.results[6].name,
                address: body.results[6].formatted_address
            },{
                name: body.results[7].name,
                address: body.results[7].formatted_address
            },{
                name: body.results[8].name,
                address: body.results[8].formatted_address
            }])
        }
    });
};

module.exports.getChurch = getChurch