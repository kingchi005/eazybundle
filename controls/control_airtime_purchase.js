const User = require("../models/userModel");
const {Transaction, create_transaction} = require("../models/transactionModel");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const axios = require('axios');

const KEY = process.env.SUP_JA_K


const process_airtime = async (req, res, next) => {
	const id = req.params.id;
  const {network, amount, mobile_number, net_name} = req.body;
  if (mobile_number == '') {
  	return res.status(400).json({error:{message:'Please enter a phone number', type:'danger'}})
  }
  if (amount < 100) {
  	return res.status(400).json({error:{message:'Please enter amount greater than 100', type:'warning'}})
  }
	const user = await User.findById(id);
	const bal = user.balance
	if (bal < amount) {
  	return res.status(400).json({error:{message:"Insufficient balance", type:'danger'}})
	}
	let airtime_trn = {
    network,
    amount,
    mobile_number,
    Ported_number: true,
    airtime_type: "VTU" 
  }
  let New_balance = bal - amount;

  // third party request

	res.locals.user = user;
	res.locals.New_balance = New_balance;
	res.locals.airtime_trn = airtime_trn;
	next();
};



//third party API request
const proceed_airtime_purchase = async (req, res) => {
	const {network, amount, mobile_number, net_name} = req.body;
	const {user, airtime_trn, New_balance} = res.locals;
	const transaction = /*await fetch(url, option)*/ false

	let data = JSON.stringify(airtime_trn)


	let config = {
	  method: 'post',
	  url: 'https://www.superjara.com/api/topup/',
	  headers: { 
	    'Authorization': 'Token '+KEY, 
	    'Content-Type': 'application/json'
	  },
	  data : data
	};

	axios(config)
	.then(response => {
	  // console.log(JSON.stringify(response.data));
	  
		if(response.data.Status === 'successful') {
			let trn = {
				user_name:user.user_name
				,Type: `${net_name}`
				,Description: 'Airtime transaction'
				,Amount: amount
				,cost_price: response.data.paid_amount
				,Phone: response.data.mobile_number
				,Previous_balance: user.balance
				,New_balance
			}
			create_transaction(trn)
				.then(created_trn => {
					res.status(created_trn.status).json({message:created_trn.message, type:created_trn.type, transaction_details: created_trn.details})
				})
				.catch(error => {
					console.log(JSON.stringify(error,null,2))
					res.status(501).json({error: {message: 'Something went wrong please contact the Admin for your support', type: 'danger'}})
				})
		}
	})
	.catch((error) => {
	  console.log(JSON.stringify(error,null,2));
	  // console.log(JSON.stringify(response.data));
		res.status(501).json({error: {message: 'Something went wrong please contact the Admin for your support', type: 'danger'}})
	});
};


module.exports = {
	process_airtime,
	proceed_airtime_purchase,
}