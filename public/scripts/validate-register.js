$('document').ready(() => {
  $('.password-check').on('change keyup paste', () => {
    if (($('.password').val() === $('.password-check').val()) && ($('.username').val() !== '')) {
      $('.login-btn').prop('disabled', false);
    } else {
      $('.login-btn').prop('disabled', true);
    }
  });
});
