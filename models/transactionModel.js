const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../sql_db');

const generateMongoObjectId = () => {
  const thousand = 1000;
  const sixteen = 16;
  const timestamp = ((new Date().getTime() / thousand) | 0).toString(sixteen);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, function () {
        return ((Math.random() * sixteen) | 0).toString(sixteen);
      })
      .toLowerCase()
  );
};


const Transaction = sequelize.define('transaction', {
	_id: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
		unique: true,
		defaultValue: generateMongoObjectId()
	}
	,user_name: { type: DataTypes.STRING }
	,Type: { type: DataTypes.STRING }
	,Description: { type: DataTypes.STRING }
	,Amount: { type: DataTypes.FLOAT }
	,cost_price: { type: DataTypes.FLOAT }
	,Phone: { type: DataTypes.BIGINT }
	,Previous_balance: { type: DataTypes.FLOAT }
	,New_balance: { type: DataTypes.FLOAT }
})

Transaction.sync({force: false})
	.then(() => {console.log('Transactions ready') })
	.catch(err => {console.log(err) })

// Transaction hooks-----
let helpUrl = 'https://sequelize.org/docs/v6/other-topics/hooks/#instance-hooks'
Transaction.afterCreate(trn => {
	const {_id, user_name, New_balance} = trn;
	handleUserUpdate(user_name, New_balance)
})
// Transaction.addHook('afterCreate', async function (trn, options) {
// 	console.log(options)
// 	// const add_trn = await findByIdAndPushArr()
// })
const {User, findByIdAndPushArr} = require("../models/userModel");

async function handleUserUpdate(un, nb) {
	let trn_by = await User.update({ New_balance:nb }, {
		where: { user_name:un }
	})
	// console.log(trn_by)
}


/*=================--------------------------**test**--------------------=============================*/
let transaction_structure = {
  user_name: 'Grace Uhe',
  Type: 'test transactioin',
  Description: '1GB for 30days 350',
  Amount: 50,
  cost_price: 49,
  Phone: '090909',
  Previous_balance: 2000,
  New_balance: 1650
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
		res.status = 500;
		res.message = e;
		res.type = 'danger';
	}
	return res;
}
create_transaction(transaction_structure)


console.log(User)

module.exports = { Transaction, create_transaction, }