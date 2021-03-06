$(document).ready(() => {
  let i = false;
  
	$('#edit-btn').on('click', () => {
	  if (i) {
      i = false;
      $('#edit-review').hide();
      $('#edit-btn').html('Edit, now!');
      $('#read-review').show();
	  } else {
      i = true;
      $('#edit-review').show();
      $('#read-review').hide();
      $('#edit-btn').html('Maybe not..');
      $('.edit').val('');
	  }
  });
  
  $('#confirm-edit-btn').on('click', () => {

    // correct url path
    const location = window.location.href;
    const tmp = location.split('/');
    const url = tmp[0] + '//' + tmp[2] + '/reviews/' + tmp[4];

    // edit info
    const reviewID = $('[name="reviewID"]').val();
    const review = $('[name="reviewEdit"]').val();
    const rating = $('[name="ratingEdit"]').val();

    const data = {
      id: reviewID,
      review: review,
      rating: rating,
    };

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      response.json();
    }).then((data) => {
      window.location.reload();
    });

  });
});
  