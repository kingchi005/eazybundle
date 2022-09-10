const User = require("../models/userModel");
const {Transaction, create_transaction} = require("../models/transactionModel");
const {select_plan} = require('../models/pricing');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const axios = require('axios');

const API_KEY = process.env.SUP_JA_K

/*const create_trn = async (req,res) => {
	//perform some authentication
	
	let trn = await create_transaction(req.body);
	res.status(trn.status).json({message:trn.message, type:trn.type});
}*/


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
		return res.status(417).json({error: 'Insufficient balance', message: 'You have insufficient balance to continue this transaction, Please fund your wallet and continue', type: 'info'})
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
	  console.log(response.data);
			/*{  id: 2823557,
			  ident: 'Data6b96ff5f2-ebf',
			  customer_ref: null,
			  network: 1,
			  balance_before: '244.0',
			  balance_after: '133.0',
			  mobile_number: '09166203938',
			  plan: 242,
			  Status: 'failed',
			  api_response: '',
			  plan_network: 'MTN',
			  plan_name: '500.0MB',
			  plan_amount: '111.0',
			  create_date: '2022-09-09T00:30:44.966289',
			  Ported_number: true
			}*/
	  if(response.data.Status === 'successful') {
  		let New_balance = user.balance - amount;
  		let trn = {
  			user_name: user.user_name
  			,Type:response.data.plan_network
  			,Description
  			,Amount:amount
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