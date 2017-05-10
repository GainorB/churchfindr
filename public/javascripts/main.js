console.log("main.js is connected.");

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
    axios.delete('https://immense-temple-47734.herokuapp.com/'+id);
    });
});

// SAVED
savedBTN.forEach(function(element, index){
    element.addEventListener('click', function(){

    let id = element.getAttribute('id');
    console.log('Saved Clicked '+id);
    
    // AXIOS PATCH ROUTE
    axios.patch('https://immense-temple-47734.herokuapp.com/savetoprofile/'+id);
    });
});