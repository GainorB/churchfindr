console.log("saved.js is connected.");

var deleteBTN = document.querySelectorAll('.delete');
var reviewBTN = document.querySelectorAll('.review');

// DELETE
deleteBTN.forEach(function(element, index) {
    element.addEventListener('click', function(){

    let id = element.getAttribute('id');

    element.parentNode.parentNode.removeChild(element.parentNode);
    
    // AXIOS DELETE ROUTE
    axios.delete('https://immense-temple-47734.herokuapp.com/'+id);
    });
});

// REVIEW
reviewBTN.forEach(function(element, index) {
    element.addEventListener('click', function(){

    let id = element.getAttribute('id');
    let parent = element.parentNode;

    //CREATE INPUT
    var input = document.createElement('input');
    input.type = "text";
    input.placeholder = "Leave a review. Click Enter to save."
    input.setAttribute('id', 'review');
    parent.appendChild(input);

        input.addEventListener('change', function(){
            var grabReview = document.getElementById('review').value;
            console.log(grabReview);

            // AXIOS PATCH ROUTE
            axios.patch('https://immense-temple-47734.herokuapp.com/reviews/'+id, {
                review: grabReview,
                id: id
            });
        });
    });
});