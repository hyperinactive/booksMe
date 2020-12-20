$(document).ready(() => {
  let i = false;
  $('#add-book-button').on('click', () => {
    if (i) {
      i = false;
      $('#add-book').hide();
      $('#add-book-button').html('Add a book, now!');
    } else {
      i = true;
      $('#add-book').show();
      $('#add-book-button').html('Maybe not..');
      $('.empty-me').val('');
    }
  });
});
