const multer = require('multer');
const crypto = require('crypto');
const mongoose = require('mongoose');
const GridFSStorage = require('multer-gridfs-storage');
const path = require('path');

const storage = new GridFSStorage({
  url: mongoose.connection._connectionString,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

const fileFilter = (req, file, cb) => {
  file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'
    ? cb(null, true)
    : cb(new Error('Allowed image formats are jpg/jpeg/png'), false);
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024,
	},
	fileFilter: fileFilter,
});

module.exports = upload;