const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserController = require('../controllers/userController');

// handle login
router.get('/login', UserController.renderLogin);
router.post('/login', UserController.login);

// handle register
router.get('/register', UserController.renderRegister);
router.post('/register', UserController.register);

// handle logout
router.get('/logout', UserController.logout);

// handle direct user route calls
router.get('/:userID', UserController.renderUser);

module.exports = router;