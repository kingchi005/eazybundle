const User = require("../models/userModel");
const {Transaction, create_transaction} = require("../models/transactionModel");
const {select_plan} = require('../models/pricing');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const axios = require('axios');

const API_KEY = process.env.SUP_JA_K


//get the price of select data plan
const get_price = (req, res) => {
	const {network, plan} = req.body;
  let pricing = select_plan(network, plan)
  res.status(200).json({pricing})
}


const process_transaction = async (req, res, next) => {
	const id = req.params.id;
	const {network, plan_id, number, amount, Description} = req.body;
	const user = await User.findById(id);
	if (!user) {
  	res.redirect('/')
		// return res.status(403).send('who the heck are you')
	}

	let availble_balance = user.balance;
	if (availble_balance < amount) {
		return res.status(400).json({error:{message:"Insufficient balance", type:'danger'}})
		// return res.status(417).json({error: 'Insufficient balance', message: 'You have insufficient balance to continue this transaction, Please fund your wallet and continue', type: 'info'})
	}
	//REQUEST TO THIRD PARTY API
	res.locals.user = user;
	next();
}


const proceed_puchase_data = async (req, res) => {
	const {user} = res.locals;
	const {network, plan_id, number, amount, Description, net} = req.body;
	let data = {
		network,
		mobile_number: number, /*09166203938*/
		plan: plan_id,
		Ported_number: true
	};

	data = JSON.stringify(data);
	let config = {
	  method: 'POST',
	  url: 'https://www.superjara.com/api/data/',
	  headers: { 
	    'Authorization': 'Token '+API_KEY,
	    'Content-Type': 'application/json'
	  },
	  data : data
	};

	axios(config)
		.then(response => {
		  if(response.data.Status === 'successful') {
	  		let New_balance = user.balance - amount;
	  		let trn = {
	  			user_name: user.user_name
	  			,Type:`${response.data.plan_network} Data`
	  			,Description
	  			,Amount:amount
	  			,cost_price: response.data.plan_amount
	  			,Phone: response.data.mobile_number
	  			,Previous_balance: user.balance
	  			,New_balance
	  		}
	  		create_transaction(trn)
	  			.then(created_trn => {
			  		res.status(created_trn.status).json({message:created_trn.message, type:created_trn.type, transaction_details: created_trn.details});
	  			})
	  			.catch(error => {
			  		res.status(501).json({error: {message: 'Something went wrong please contact the Admin for your support', type: 'danger'}})
	  			})
	  	}else {
	  		res.status(501).json({error: {message: 'Something went wrong please contact the Admin for your support', type: 'danger'}})
	  	}   
		})
		.catch((error) => {
			res.status(501).json({error: {message: 'Something went wrong please contact the Admin for your support', type: 'danger'}})
		});
};


module.exports = {
	// create_trn,
	process_transaction,
	get_price,
	proceed_puchase_data,
}