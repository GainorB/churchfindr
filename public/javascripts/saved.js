console.log("saved.js is connected.");

// GRAB DOM ELEMENTS
var deleteBTN = document.querySelectorAll('.delete');
var reviewBTN = document.querySelectorAll('.review');
var smsBTN = document.querySelectorAll('.sms');

// DELETE
deleteBTN.forEach(function(element, index) {
    element.addEventListener('click', function(){

    let id = element.getAttribute('id');
    console.log('Delete Clicked '+id);

    element.parentNode.parentNode.removeChild(element.parentNode);
    
    // AXIOS DELETE ROUTE
    axios.delete('https://immense-temple-47734.herokuapp.com/'+id);
    });
});

// REVIEW
reviewBTN.forEach(function(element, index) {
    element.addEventListener('click', function(){

    let id = element.getAttribute('id');
    console.log('Review Clicked '+id);
    let parent = element.parentNode;

    //CREATE INPUT
    var input = document.createElement('input');
    input.type = "text";
    input.placeholder = "Type a review. Click Enter to save."
    input.setAttribute('id', 'review_input');
    parent.appendChild(input);

        input.addEventListener('change', function(){
            var grabReview = document.getElementById('review_input').value;
            console.log("id: "+id + " review: " +grabReview);

            // AXIOS PATCH ROUTE
            axios.patch('https://immense-temple-47734.herokuapp.com/reviews/'+id, {
                review: grabReview,
                id: id
            });
        });
    });
});

// SMS
smsBTN.forEach(function(element, index) {
    element.addEventListener('dblclick', function(){

    let id = element.getAttribute('id');
    console.log('SMS Clicked '+id);
    let parent = element.parentNode;

    // GRAB THE ADDRESS
    let address = element.parentNode.textContent;
    address = address.substring(0, address.indexOf('|'));

    console.log(address);

        // AXIOS PATCH ROUTE
        axios.patch('https://immense-temple-47734.herokuapp.com/sms', {
            address: address
        });
    });
});