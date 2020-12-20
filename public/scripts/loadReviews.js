document.addEventListener('DOMContentLoaded', function () {
  let loadedReviews = 0;
  const rate = 16;
  let isEmpty = false;

  options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  const handleIntersect = (entries) => {
    if (entries[0].isIntersecting) {
      console.warn('Bottomn reached - Loading data');
      loadReviews();
    }
  };

  const observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(document.querySelector('footer'));

  // DRY!?!?!?

  // todo: maybe reuse the loadBooks script and send different responses based on the input?

  const loadReviews = () => {
    const requestLoading = async () => {
      // if the db has no more items to send, don't send any more requests
      if (isEmpty === true) {
        return;
      }

      // get the current site url and append the bookAPI route
      const location = window.location.href;
      const tmp = location.split('/');
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
          data.data.forEach((review) => {
            date = new Date(review.timestamp).getDate().toString();
            month = new Date(review.timestamp).getMonth().toString();
            year = new Date(review.timestamp).getFullYear().toString();

            formattedTimestampString = `${date}/${month}/${year}`;

            const reviewItem = `
          <form action="/reviews/${review._id}" method="get">
            <div class="grid-item" onClick="javascript:this.parentNode.submit();">
              <div class="review rev">
                <div>${
                  review.rev.length >= 100
                    ? review.rev.substr(0, 99).toString().concat('...')
                    : review.rev
                }</div>
              </div>

              <div class="review-stats rev">
              <div class="user">${review.user}</div>
              <div>${formattedTimestampString}</div>
              <div class="rating">${review.rating}</div>
              
            </div>
            </div>
            
          </form>`;
            $('.grid-container').append(reviewItem);
          });
          if (data.empty === true) {
            isEmpty = true;
            return;
          }
        });
      loadedReviews += rate;
    };

    requestLoading();
  };
});
