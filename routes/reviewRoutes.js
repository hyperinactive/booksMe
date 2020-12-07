const express = require('express');
const router = express.Router();

const ReviewController = require('../controllers/reviewController');
const ReviewAPI = require('../api/reviewAPI');

router.get('/', ReviewController.getReviews);
router.post('/', ReviewController.createReview);
router.delete('/', ReviewController.deleteReview);

router.post('/:bookID', ReviewAPI.getReviewsSingleBook);

module.exports = router;
