document.addEventListener('DOMContentLoaded', function () {
  // search params object
    // -------------------------------
  globals = {
    loadedBooks: 0,
    rate: 8,
    isEmpty: false,
    sort: -1,
    search: '',
  }

  // hard reset
  const resetSearchParams = () => {
    globals.loadedBooks = 0;
    globals.rate = 8;
    globals.isEmpty = false;
    globals.sort = -1;
    globals.search = '';
  }
  // -------------------------------


  // Intersect Observer
  // -------------------------------
  options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  const handleIntersect = (entries) => {
    if (entries[0].isIntersecting) {
      console.warn('Bottomn reached - Loading data');
      loadBooks();
    }
  };

  const observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(document.querySelector('footer'));
  // -------------------------------


  $('#search').click(() => {
    console.log('clicked');

    // assume the client want to reset the whole thing
    resetSearchParams();
    globals.search = $('#search-input').val();

    $('#search-input').val('');

    // reset the global search object and clear the container
    console.log('globabs has been reset');
    console.log(globals);
    console.log('------------------------------');
    $('.grid-container').html('');

    // stop uncommenting this, the observer will call it automatically when the wrapper gets emptied
    // loadBooks()
  });

  const loadBooks = () => {
    // loaded books isn't the actual number of loaded books
    // it's an offset for the db

    const requestLoading = async () => {
      // if the db has no more items to send, don't send any more requests
      if (globals.isEmpty === true) {
        return;
      }

      // get the current site url and append the bookAPI route
      const location = window.location.href;
      const tmp = location.split('/');
      const url = tmp[0] + '//' + tmp[2] + '/bookAPI';

      console.log(globals);

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(globals),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          console.log(`--------------------------`);
          // if the last payload turned out empty, no more items are to be requested

          // <button class="btn-danger page-btn" type="submit">Page</button>

          data.data.forEach((book) => {
            const pathToCover = book.coverImage
              .replace(/\\/g, '/')
              .replace('public/', '');

            const bookItem = `
            <form action="/books/${book._id}" method="get">
              <div class="grid-item" onClick="javascript:this.parentNode.submit();">
                <div class="thumb" style="background: url(${pathToCover}) no-repeat center center; background-size: cover;">
                  <div class="hover-info hover-rating">${
                    book.averageRating % 1 === 0
                      ? book.averageRating
                      : book.averageRating.toFixed(2)
                  }</div>
                  <div class="hover-info hover-reviews">${
                    book.numberOfReviews
                  }</div>
                </div>
                
                <div class="book-info">
                  <div>${book.title}</div>
                  <div class="book-author">by ${book.author.name}</div>
                </div>
              </div>
            </form>`;
            $('.grid-container').append(bookItem);
          globals.loadedBooks++;
          });
          if (data.empty === true) {
            globals.isEmpty = true;
            return;
          }
        });
    };

    requestLoading();
  };
});
