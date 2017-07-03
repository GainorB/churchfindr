//console.log("main.js is connected.");

// GRAB DOM ELEMENTS
var deleteBTN = document.querySelectorAll('.delete');
var savedBTN = document.querySelectorAll('.save');

// DELETE
deleteBTN.forEach(function(element, index){
    element.addEventListener('click', function(){
    
    let id = element.getAttribute('id');
    console.log('Delete Clicked '+id);

    element.parentNode.parentNode.removeChild(element.parentNode);
    
    // AXIOS DELETE ROUTE
    axios.delete('https://churchfindr.herokuapp.com/'+id);
    });
});

// SAVED
savedBTN.forEach(function(element, index){
    element.addEventListener('click', function(){

    let id = element.getAttribute('id');
    console.log('Saved Clicked '+id);
    
    // AXIOS PATCH ROUTE
    axios.patch('https://churchfindr.herokuapp.com/savetoprofile/'+id);
    });
});