// setup, make a router
const express = require('express');
const router = express.Router();
const uploadToDisk = require('../middleware/multerDiskStorageConfig');
const uploadToDB = require('../middleware/multerGridFSConfig');

const BookController = require('../controllers/bookController');

router.get('/', BookController.renderBooks);
// legacy code hihi
// router.post('/', uploadToDisk.single('coverImage'), BookController.createBook);
router.post('/', uploadToDB.single('coverImage'), BookController.createBook);
router.get('/images/:imageID', BookController.getCover);
router.get('/:bookID', BookController.getBook);

module.exports = router;
