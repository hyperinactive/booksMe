// setup, make a router
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

const BookController = require('../controllers/bookController');

router.get('/', BookController.getBooks);
router.post('/', upload.single('coverImage'), BookController.createBook);
router.get('/:bookID', BookController.getBook);

module.exports = router;
