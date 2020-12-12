$(document).ready(() => {
  let i = false;
  $('#add-review-btn').on('click', () => {
    if (i) {
      i = false;
      $('#add-review').hide();
      $('#add-review-btn').html('Write a review!');
    } else {
      i = true;
      $('#add-review').show();
      $('#add-review-btn').html('Maybe not');
      $('.empty-me').val('');
    }
  });
});
