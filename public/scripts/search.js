$('document').ready(() => {
  const searchFn = () => {
    const search = $('.search-input').val().toLowerCase();
    $('.search-input').val('');
    $('.search-input').focus();

    if (search === '' || search === 'show_all') {
      $('.book-row').show();
    } else if (search === 'hide_all') {
      $('.book-row').hide();
    } else {
      arr.forEach((element) => {
        if (
          element.children[0].children[0].innerHTML
            .toLowerCase()
            .includes(search) ||
          element.children[0].children[1].innerHTML
            .toLowerCase()
            .includes(search) ||
          element.children[0].children[2].innerHTML
            .toLowerCase()
            .includes(search)
        ) {
          if (element.style.display == 'none') {
            element.style.display = 'block';
          } else {
            element.style.display = 'block';
          }
        } else if (
          element.children[0].children[0].innerHTML.toLowerCase() === search ||
          element.children[0].children[1].innerHTML.toLocaleLowerCase() ===
            search ||
          element.children[0].children[2].innerHTML.toLowerCase() === search
        ) {
          if (element.style.display == 'none') {
            element.style.display = 'block';
          } else {
            element.style.display = 'block';
          }
        } else {
          element.style.display = 'none';
        }
      });
    }
  };

  let arr = document.querySelectorAll('.book-row');

  // button clicked
  $('.search-btn').click(() => {
    searchFn();
  });

  //   enter pressed
  $('.search-input').keypress((e) => {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
      console.log('pressed enter');
      searchFn();
    }
  });
});
