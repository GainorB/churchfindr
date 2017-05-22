'use strict'
console.log('map.js is connected');

const locations = [];
let newObj = { lat: 0, lng: 0 };

axios.get("https://churchfindr.herokuapp.com/api/churches")
    .then((data) => {
        data.data.data.forEach((element) => {
            locations.push({lat: element.lat, lng: element.lng }) 
        });

        // CREATING CENTER COORDINATES FOR GOOGLE MAPS
        let lat = locations.reduce(function(accumulator, value) { return accumulator + value.lat; }, 0);
        let lng = locations.reduce(function(accumulator, value) { return accumulator + value.lng; }, 0);

        // CREATE NEW OBJECT WITH LAT AND LNG AND GET THE AVERAGE
        newObj = { lat: ((lat)/(locations.length)), lng: ((lng)/(locations.length)) };

        initMap();
    }).catch((err) => console.log(err));

function initMap(){
    var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: newObj.lat, lng: newObj.lng}
        });

    // Create an array of alphabetical characters used to label the markers.
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var markers = locations.map(function(location, i) {
          return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
          });
        });

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}