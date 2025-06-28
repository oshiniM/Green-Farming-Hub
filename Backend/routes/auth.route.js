const express = require('express');
const { signup, login, logout } = require('../Controllers/auth.controller');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// router.post('/verify-email', verifyEmail)

module.exports = router;
