const express = require('express');
const router = express.Router();
const {
	control_signup,
	control_login,
	logout_user
} = require('../controls/authControl');

router.post('/signup', control_signup)
router.post('/login', control_login)
router.get('/logout', logout_user)

module.exports = router;