const loadABook = async () => {
  const url = 'http://localhost:3000/bookAPI';

  fetch(url)
    .then((response) => response.json())
    .then((json) => console.log(json));

  const data = await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((book) => {
        console.log(book);
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
};

loadABook();
