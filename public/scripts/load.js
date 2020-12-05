// loaded books isn't the actual number of loaded books
// it's an offset for the db
let loadedBooks = 0;
const rate = 8;
let isEmpty = false;

const loadABook = async () => {
  // if the db has no more items to send, don't send any more requests
  if (isEmpty === true) {
    return;
  }

  // hardcoded for now :(
  const url = 'http://localhost:3000/bookAPI';

  const data = {
    limit: rate,
    skip: loadedBooks,
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
      if (data == '') {
        isEmpty = true;
        return;
      }

      data.forEach((book) => {
        const pathToCover = book.coverImage
          .replace(/\\/g, '/')
          .replace('public/', '');
        const bookItem = `<div class="grid-item">
          <div class="thumb" style="background: url(${pathToCover}) no-repeat center center; background-size: cover;">
          <div class="hover-info hover-rating">${book.averageRating}</div>
          <div class="hover-info hover-reviews">${book.numberOfReviews}</div>
          </div>
          <div class="book-info">
            <div>${book.title}</div>
            <div class="book-author">by ${book.author.name}</div>
          </div>
      </div>`;
        $('.grid-container').append(bookItem);
      });
    });
  console.log(loadedBooks, rate);
  loadedBooks += rate;
};

loadABook();

$(window).on('scroll', function () {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    // console.log('end of the road bud, or is it?');
    loadABook();
  }
});
