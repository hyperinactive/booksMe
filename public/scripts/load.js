let loadedBooks = 0;
const rate = 8;

const loadABook = async () => {
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
      data.forEach((book) => {
        const pathToCover = book.coverImage
          .replace(/\\/g, '/')
          .replace('public/', '');
        const bookItem = `<div class="grid-item">
          <div class="thumb" style="background: url(${pathToCover}) no-repeat center center; background-size: cover;"></div>
          <div class="book-info">
            <div>${book.title}</div>
            <div>${book.author.name}</div>
                <div class="add-info">
                    <div>
                        Rating: ${book.averageRating}
                    </div>
                    <div>
                        Reviews: ${book.numberOfReviews}
                    </div>
                </div>
          </div>
      </div>`;
        $('.grid-container').append(bookItem);
      });
    });
  loadedBooks += rate;
};

loadABook();

// PRO: works
// CON: will send requests to update even when there are no elements to load
$(window).on("scroll", function () {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    console.log('end of the road bud, or is it?');
    loadABook();
  }
});