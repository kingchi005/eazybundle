// const { Sequelize, Model, DataTypes } = require('sequelize');
const {Transaction} = require('./utileModel');
const {User} = require('./utileModel');




/*=================--------------------------**test**--------------------=============================*/
let transaction_structure = {
  user_name: 'Grace Uhe',
  Type: 'test transactioin',
  Description: '1GB for 30days 350',
  Amount: 50,
  cost_price: 49,
  Phone: '090909',
  Previous_balance: 2000,
  New_balance: 1350
}

/*=================--------------------------**test**--------------------=============================*/

const create_transaction = async (transaction_details) => {
	let res = {status: 0, message: '', type: ''}
	try {
		const details = await Transaction.create(transaction_details)
		res.status = 202;
		res.message = 'Transaction successful';
		res.type = 'success';
		details.cost_price = details.Amount
		res.details = details;
	} catch(e) {
		console.log(e)
		res.status = 500;
		res.message = e;
		res.type = 'danger';
	}
	return res;
}
// create_transaction(transaction_structure)


// console.log(User)

module.exports = { Transaction, create_transaction, }