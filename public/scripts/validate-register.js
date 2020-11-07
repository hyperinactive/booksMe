$('document').ready(() => {
  $('.password-check').on('change keyup paste', () => {
    if ($('.password').val() === $('.password-check').val()) {
      $('.register-btn').prop('disabled', false);
    } else {
      $('.register-btn').prop('disabled', true);
    }
  });
});
