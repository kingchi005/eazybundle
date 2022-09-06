const express = require('express');
const router = express.Router();
const {requireAuth} = require('../controls/authControl');
const verify_bank_details = require('../controls/verifyBank');

const {
	update_password,
	update_bank,
	update_phone,

} = require('../controls/profileControl');

router.put('/password/:id', requireAuth, update_password);
router.post('/bank-details/:id', requireAuth, update_bank);
router.post('/add-phonenumber/:id', requireAuth, update_phone);
router.get('/verify-bank-details', /*requireAuth,*/ verify_bank_details)

module.exports = router;