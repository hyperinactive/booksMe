document.addEventListener("DOMContentLoaded", function () {
  console.log('sanity check');
  loadReviews();
 });


// DRY!?!?!?

// todo: maybe reuse the loadBooks script and send different responses based on the input?

const loadReviews = () => {
  let loadedReviews = 0;
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
    // console.log(tmp);
    const url = tmp[0] + '//' + tmp[2] + '/reviews/' + tmp[4];

    // console.log(`URL: ${url}`);
    // http://localhost:3000/books/5fc93214dd2ae74334c47ce6/



    const data = {
      limit: rate,
      skip: loadedReviews,
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

        data.data.forEach((review) => {
          const reviewItem = `
          <div class="grid-item>
            <div">
              <div>${review.rating}</div>
            </div>
          </div>`;
          $('.grid-container').append(reviewItem);
        });
        if (data.empty === true) {
          isEmpty = true;
          $('.loader').html('Please, no more x(');
          return;
        }
      });
    loadedReviews += rate;
  };

  requestLoading();
  $('.loader').on('click', () => {
    requestLoading();
  });
}