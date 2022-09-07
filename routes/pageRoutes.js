const express = require('express');
const router = express.Router();
const {requireAuth} = require('../controls/authControl');
const {fetch_transactions} = require('../controls/middlewares');
const {banks} = require('../models/banks');
const {airtime_prices, superJara} = require('../models/pricing');

router.get('/dashboard', requireAuth, (req, res) => {
	res.render('dashboard', {title: 'Dashboard'})
})
router.get('/profile', requireAuth, (req, res) => {
	res.render('profile', {title: 'Profile', ref_id: 'kingchika', banks})
})
router.get('/login', (req, res) => {
	res.render('login', {title: 'Log in'})
})
router.get('/signup', (req, res) => {
	let refr = req.query.ref || ''
	res.render('signup', {title: 'Register', ref_id: refr})
})
router.get('/fund-wallet', requireAuth, (req, res) => {
  res.render('fund-wallet', {title: 'Fund wallet'}) 
})
router.get('/transactions', requireAuth, fetch_transactions, (req, res) => {
  res.render('transactions', {title: 'Transacions'}) 
})
router.get('/testing',(req, res) => {
  console.log(req.connection)
  // res.send(JSON.parse(req.header))
})


//airtime render
router.get('/airtime/:id', requireAuth, (req, res) => {
	let network = req.params.id;
	for (var i = 0; i < airtime_prices.length; i++) {
		if (network === airtime_prices[i].package.name) {
		  return res.render('buy-airtime', {
		  	title: airtime_prices[i].title
		  	,package: {
			  	name: airtime_prices[i].package.name
			  	,network: airtime_prices[i].package.network
			  }
		  }) 
		}
	}
})


//data trn render
router.get('/data-bundle/:id', requireAuth, (req, res) => {
	let network = req.params.id;
	for (var i = 0; i < superJara.length; i++) {
		if (network === superJara[i].net) {
		  return res.render('buy-data', {
		  	title: superJara[i].name
		  	,package: superJara[i].name
		  	,network: superJara[i].network
		  	,price_list: superJara[i].price_list
		  })
		}
	}
})

// console.log(superJara)


module.exports = router;