const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserController = require('../../controllers/userController');

router.get('/', UserController.logout);

module.exports = router;