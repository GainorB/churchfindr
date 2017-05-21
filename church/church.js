const request = require('request');

var getChurch = (city, callback) => {
    request({
        url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}&type=church&rankBy=distance&key=${process.env.API_KEY}`,
        json: true
    }, (err, res, body) => {
        //console.log(body.results["0"].geometry.location.lat);
        //console.log(body.results["0"].geometry.location.lng);
        if (err) {
            callback('Unable to connect to google API server.');            
        } else if (res.statusCode === 400) {
            callback('Unable to fetch data.');
        } else if (res.statusCode === 200) {
            callback(undefined, [{
                name: body.results[0].name,
                address: body.results[0].formatted_address,
                lat: body.results[0].geometry.location.lat,
                lng: body.results[0].geometry.location.lng
            }, {
                name: body.results[1].name,
                address: body.results[1].formatted_address,
                lat: body.results[1].geometry.location.lat,
                lng: body.results[1].geometry.location.lng
            }, {
                name: body.results[2].name,
                address: body.results[2].formatted_address,
                lat: body.results[2].geometry.location.lat,
                lng: body.results[2].geometry.location.lng
            },{
                name: body.results[3].name,
                address: body.results[3].formatted_address,
                lat: body.results[3].geometry.location.lat,
                lng: body.results[3].geometry.location.lng
            },{
                name: body.results[4].name,
                address: body.results[4].formatted_address,
                lat: body.results[4].geometry.location.lat,
                lng: body.results[4].geometry.location.lng
            },{
                name: body.results[5].name,
                address: body.results[5].formatted_address,
                lat: body.results[5].geometry.location.lat,
                lng: body.results[5].geometry.location.lng
            },{
                name: body.results[6].name,
                address: body.results[6].formatted_address,
                lat: body.results[6].geometry.location.lat,
                lng: body.results[6].geometry.location.lng
            },{
                name: body.results[7].name,
                address: body.results[7].formatted_address,
                lat: body.results[7].geometry.location.lat,
                lng: body.results[7].geometry.location.lng
            },{
                name: body.results[8].name,
                address: body.results[8].formatted_address,
                lat: body.results[8].geometry.location.lat,
                lng: body.results[8].geometry.location.lng
            }])
        }
    });
};

module.exports.getChurch = getChurch