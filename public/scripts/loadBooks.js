document.addEventListener('DOMContentLoaded', function () {
  let loadedBooks = 0;
  const rate = 8;
  let isEmpty = false;

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

  const loadBooks = () => {
    // loaded books isn't the actual number of loaded books
    // it's an offset for the db

    const requestLoading = async () => {
      // if the db has no more items to send, don't send any more requests
      if (isEmpty === true) {
        return;
      }

      // get the current site url and append the bookAPI route
      const location = window.location.href;
      const tmp = location.split('/');
      const url = tmp[0] + '//' + tmp[2] + '/bookAPI';

      const data = {
        limit: rate,
        skip: loadedBooks,
        sort: -1
      };

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
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
          });
          if (data.empty === true) {
            isEmpty = true;
            return;
          }
        });
      loadedBooks += rate;
    };

    requestLoading();
  };
});
