require('dotenv').config();
const User = require("../models/userModel");
const {Transaction, create_transaction} = require("../models/transactionModel");
const https = require('https');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// const fetch = import('node-fetch');
// import fetch from 'node-fetch'

const API_KEY = process.env.PAK;


/*fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))
*/
//Proccess the FUND WALLET Transacrion
const process_fund_wallet = async (email, amount) => {
  const user = await User.findOne({email});
  // console.log(user)
  let New_balance = user.balance + amount;
  let trn = {user_name: user.user_name ,Type: 'Fund wallet' ,Description: 'Credit transaction' ,Amount: amount ,Phone: user.phone ,Previous_balance: user.balance ,New_balance }
  let res = await create_transaction(trn);
	const notify = `Your wallet has been succesfully funded with the sum of ₦ ${amount}, your new balance is ₦ ${New_balance} |${Date.now()}`
  if (res) {
  	User.updateMany({email : email}, {$push: {notifications: notify}})
  		.then(use => {})
  		.catch(err => {})
	  return res;
  }
};


const verify_paystack_trn =  (req,response) => {
	let ref = req.params.ref;
	const options = {
	  hostname: 'api.paystack.co',
	  port: 443,
	  path: '/transaction/verify/'+ref,
	  method: 'GET',
	  headers: {
	    Authorization: 'Bearer '+API_KEY
	  }
	}

	let request = https.request(options, res => {
	  let data = ''

	  res.on('data', (chunk) => {
	    data += chunk
	  });
	  res.on('end', () => {
	  	const vr = JSON.parse(data)
	  	handle_response(vr);
	    // console.log(JSON.parse(data))
	  })
	}).on('error', error => {
		const Err = {err: error,}
		handle_response(Err)
	  console.log(JSON.stringify(error,null,2))
	})
	request.end()


	// *FETCH METHOD
/*	fetch('https://api.paystack.co:443/transaction/verify/'+ref, {method: 'GET', headers: {Authorization: 'Bearer '+API_KEY } })
		.then(res => {res.json()})
		.then(data => {

			handle_response(data)
		})
		.catch(err => {
		  handle_response(err)
		})*/



//handling verification response
	const handle_response = async (result) => {
		if (result.err) {
			return response.status(501).json({error: {message: 'Something went wrong please contact the Admin for support', type: 'danger'}})
		}
		if (result.status == false) {
			return response.status(501).json({error: {message: 'Something went wrong please contact the Admin for support', type: 'danger'}})
		}
		if (result.data.status === 'success') {
			// return response.json({msd:'about tp fun u'})
			let email = result.data.customer.email
			let amount = (result.data.amount / 100)*0.98
			// return response.json({email,amount})
			let processed_trn = await process_fund_wallet (email, amount);
			return response.status(processed_trn.status).json({message: processed_trn.message, type: processed_trn.type, transaction_details:processed_trn.transaction_details});
		}
		return response.status(501).json({error: {message: 'Something went wrong please contact the Admin for support', type: 'danger'}})
	}
};



module.exports = {
	verify_paystack_trn,
}