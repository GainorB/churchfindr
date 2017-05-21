console.log('map.js is connected');

const locations = [];

axios.get("https://churchfindr.herokuapp.com/api/churches")
    .then((data) => {
        data.data.data.forEach((element) => {
            locations.push({lat: element.lat, lng: element.lng }) 
        });
        initMap();
    }).catch((err) => console.log(err));

function initMap(){
    var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: 40.63818905, lng: -73.60413015}
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