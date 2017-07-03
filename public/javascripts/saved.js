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

    })

});