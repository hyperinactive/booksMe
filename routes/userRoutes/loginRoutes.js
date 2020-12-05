const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserController = require('../../controllers/userController');

router.get('/', UserController.renderLogin);
router.post('/', UserController.login);

module.exports = router;
