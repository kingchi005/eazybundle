const mongoose = require('mongoose');
const User = require("../models/userModel");
const {formatDistanceToNow, subDays, format} = require('date-fns');

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

const Transaction = mongoose.model('Transaction', transactionSchema)
module.exports = {Transaction, create_transaction};