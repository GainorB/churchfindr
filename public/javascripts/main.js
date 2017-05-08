console.log("main.js is connected.");

// GRAB DOM ELEMENTS
var searchBar = document.getElementById('main_search');
var placesDIV = document.getElementById('places');
var errorMSG = document.getElementById('error_msg_span');
var deleteBTN = document.querySelectorAll('.delete');
var savedChurches = document.getElementById('savedchurches');
var savedBTN = document.querySelectorAll('.save');

// FOCUS ON SEARCH BAR
searchBar.focus();

// DELETE
deleteBTN.forEach(function(element, index) {
    element.addEventListener('click', function(){

    let id = element.getAttribute('id');

    element.parentNode.parentNode.removeChild(element.parentNode);
    
    // AXIOS DELETE ROUTE
    axios.delete('http://immense-temple-47734.herokuapp.com/'+id);
    });
});

// SAVED
savedBTN.forEach(function(element, index) {
    console.log('saved')
    element.addEventListener('click', function(){

    let id = element.getAttribute('id');
    
    // AXIOS PATCH ROUTE
    axios.patch('http://immense-temple-47734.herokuapp.com/saved/'+id);
    });
});