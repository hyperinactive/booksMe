document.addEventListener("DOMContentLoaded", function(){
  // loaded books isn't the actual number of loaded books
// it's an offset for the db
let loadedBooks = 0;
const rate = 8;
let isEmpty = false;

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
        const bookItem = `<form action="/books/${book._id}" method="get">
        <div class="grid-item" onClick="javascript:this.parentNode.submit();">
          <div class="thumb" style="background: url(${pathToCover}) no-repeat center center; background-size: cover;">
            <div class="hover-info hover-rating">${book.averageRating}</div>
            <div class="hover-info hover-reviews">${book.numberOfReviews}</div>
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
        $('.loader').html('Please, no more x(');
        return;
      }
    });
  loadedBooks += rate;
};

requestLoading();

// can't stop it from sending 1 milion requests when it reaches the bottom :((
// todo - in case a smart solution has been found

// $(window).on('scroll', function () {
//   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
//     console.log('end of the road bud, or is it?');
//     loadABook();
//   }
// });

  $('.loader').on('click', () => {
    requestLoading();
  });

});

