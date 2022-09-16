const mongoose = require('mongoose');
const User = require("../models/userModel");
const {formatDistanceToNow, subDays, format} = require('date-fns');
// const { add_trn_bonus } = require('../controls/middlewares.js');
const axios = require('axios');


// let ca = '2022-08-23T10:55:15.565Z'
// let dated = format(new Date(ca), 'EEEE,MMMM do, yyyy hh:mm a').toString();
// console.log(dated)
/*const date = new Date('2020/09/19');
console.log(date);
console.log(`${format(date, 'dd.MM.yyyy')}`);
console.log(`${format(date, 'yyyy-MM-dd hh:mm:ss a').toString()}`);
console.log(`${format(date, 'EEEE, MMMM yyyy')}`);
console.log(`${format(date, 'EEEE,MMMM do, yyyy hh:mm a')}`);
console.log(`${format(date, 'MMMM, yyyy')}`);
console.log(`${format(date, 'MMMM.do.')}`);
console.log(`${format(date, 'EEEE do HH:mm ')}`);
console.log(`${format(date, 'EEEE,MMMM do, yyyy ppppp')}`);
console.log(`${format(date, 'do  MMMM yyyy OOOO')}`);*/
const Schema = mongoose.Schema;

const transactionSchema = Schema({
	user_name: {type: String}
	,Type: {type: String}
	,Description: {type: String}
	// ,Date: {type: Date}
	,Amount: {type: Number}
	,Phone: {type: Number}
	,Previous_balance: {type: Number}
	,New_balance: {type: Number}
}, {timestamps: true});


let transaction_structure = {
  user_name: 'eazyb',
  Type: 'MTN SME',
  Description: '1GB for 30days 350',
  Amount: '50',
  Phone: '090909',
  PreviousBalance: '2000',
  NewBalance: '1650'
}

//final transaction functions
const create_transaction = async (transaction_details) => {
	let res = {status: 0, message: '', type: ''}
	try {
		Transaction.create(transaction_details)
		res.status = 202;
		res.message = 'Transaction successful';
		res.type = 'success';
		res.details = transaction_details;
	} catch(e) {
		res.status = 500;
		res.message = e;
		res.type = 'danger';
	}
	return res;
}


//Post save updates
transactionSchema.post('save', async function (doc,next) {
	const transact_by_user = await User.updateMany({user_name: this.user_name}, {
		$push: {
			transactions: this._id
		},
		$set: {
			balance: this.New_balance
		}
	})
	if (transact_by_user) {
		let message = `${doc.user_name} purchased ${doc.Type} ${doc.Description} at ${format(new Date(doc.createdAt), 'EEEE,MMMM do, yyyy hh:mm a').toString()}`
		console.log(message);
		next();
	}
})

transactionSchema.post('save', async function (doc,next) {
	if (this.Type === 'MTN SME' || this.Type === 'Airtel Data') {
		let bonus_amount;
		if (this.Description === '3GB for 30days #1000' && this.Amount === 1000) {
			bonus_amount = 100
		} else if (this.Description === '5GB for 30days #1600' && this.Amount === 1600) {
			bonus_amount = 200
		} else if (this.Description === '10GB for 30days #3000' && this.Amount === 3000) {
			bonus_amount = 450
		} else {
			next();
		}


		let config = {
		  method: 'post',
		  url: 'https://www.superjara.com/api/topup/',
		  headers: { 
		    'Authorization': 'Token '+process.env.SUP_JA_K, 
		    'Content-Type': 'application/json'
		  },
		  data : JSON.stringify({
			    network: 1,
			    amount: bonus_amount,
			    mobile_number: `0${this.Phone}`,
			    Ported_number: true,
			    airtime_type: "VTU"
			})
		};

		axios(config)
		.then(response => {
		  // console.log(JSON.stringify(response.data));
		  
			if(response.data.Status === 'successful') {
				let trn = {
					user_name:this.user_name
					,Type: `Bonus`
					,Description: 'Airtime Bonus'
					,Amount: bonus_amount
					,Phone: response.data.mobile_number
					,Previous_balance: this.balance
					,New_balance: this.New_balance
				}
				create_transaction(trn)
					.then(created_trn => {
						if (created_trn.status === 202) {
							const notify = `Congratulation! You received a transaction bonus of NGN ${created_trn.details.Amount} in form of airtime to 0${created_trn.details.Phone}. \nPurchase more data bundle to receive airtime bonus`
							User.updateMany({user_name: this.user_name}, {
								$set: {
									trn_bonus: created_trn.details.Amount
								},
								$push: {
									notifications: notify
								}
							})
								.then(arg => {
									next();
								})
								.catch(err => {
								  next();
								})
						}
						next();
					})
					.catch(error => {
						next();
					});
			}
		})
		.catch(err => {
			next();
		})
	} else {
		next();
	}
})



const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = {Transaction, create_transaction};