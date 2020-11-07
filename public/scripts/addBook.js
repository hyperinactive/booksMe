$(document).ready(() => {
  let i = false;
  $('.add-books-button').on('click', () => {
    if (i) {
      i = false;
      $('#add-book').hide();
      $('.add-books-button').html('Add a book, now!');
    } else {
      i = true;
      $('#add-book').show();
      $('.add-books-button').html('Maybe not');
      $('.form-control').val('');
    }
  });
});
