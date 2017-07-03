$( document ).ready(function() {

    var ce = document.querySelectorAll('.ce');

    $.each(ce, (index, element) => {

        element.addEventListener('dblclick', e => {

            let review = element.textContent;
            let id = element.getAttribute('id');
            element.innerHTML = "Thanks, review submitted."

            axios.patch(`https://churchfindr.herokuapp.com/profile/review/${id}`, { id, review })
                .catch(err => { console.error(err); });
        });

    });

    // WHEN THE SCREEN IS SMALL, THIS BUTTON WILL BE GRABBALE TO SUBMIT A REVIEW
    $('.review').on('click', function(){

        let id = parseInt($(this).attr('id'));
        let review = $(this).parent().find(".ce").text();
        $(this).parent().find(".ce").html("Thanks, review submitted.");

        axios.patch(`https://churchfindr.herokuapp.com/profile/review/${id}`, { id, review })
             .catch(err => { console.error(err); });

    });

});