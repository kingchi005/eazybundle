const express = require('express');
const router = express.Router();
const {requireAuth} = require('../controls/authControl');

//Control functions
const {
	create_trn,
	process_transaction,
	proceed_puchase_data,
	get_price,
} = require('../controls/Control_data_purchase');
const {
	process_airtime,
	proceed_airtime_purchase,
} = require('../controls/Control_airtime_purchase');

const {verify_paystack_trn} = require('../controls/control_wallet_funding');

//routers
router.post('/purchase-data-bundle/:id', requireAuth, process_transaction, proceed_puchase_data);
// router.post('/paystack-fund-wallet/:id', requireAuth, process_fund_wallet);
router.get('/verify-paystack-payment/:ref', requireAuth, verify_paystack_trn);
// router.post('/get-data-price', requireAuth, get_price);
router.post('/airtime/:id', requireAuth, process_airtime, proceed_airtime_purchase);

module.exports = router;