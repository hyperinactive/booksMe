const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserController = require('../../controllers/userController');

router.get('/', UserController.renderRegister);
router.post('/', UserController.register);

module.exports = router;
