const { Sequelize,Model, DataTypes } = require('sequelize');
const {sequelize} = require('../sql_db');
const bcrypt = require('bcrypt')
// const {findPropAndPushArr, add_upline, User_login, parseUser} = require('../models/userModel');


const User = sequelize.define('user', {
	_id: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
		unique: true
	}
	,user_name: {
		type: DataTypes.STRING,
		// unique: true
		unique: {
		      args: true,
		      msg: 'User name already in use!'
		  }
	}
	,email: {
		type: DataTypes.STRING,
		// unique: true
		unique: {
		      args: true,
		      msg: 'Email address already in use!'
		  }
	}
	,password: {
		type: DataTypes.STRING,
		set(value) {
			let salt = bcrypt.genSaltSync(10);
			let hashed = bcrypt.hashSync(value, salt)
      this.setDataValue('password', hashed);
    }
	}

	,phone: { type: DataTypes.BIGINT }
	,bank_details: { type: DataTypes.JSON }

	,balance: { type: DataTypes.FLOAT }
	,trn_bonus: { type: DataTypes.FLOAT }
	,ref_bonus: { type: DataTypes.FLOAT }

	,ref_id: { type: DataTypes.STRING, unique: true }
	,upline: { type: DataTypes.STRING }

	,notifications: { type: DataTypes.JSON }
	,downlines: { type: DataTypes.JSON }
	,transactions: { type: DataTypes.JSON }
})



/*=================--------------------------**TRANSACTION**--------------------=============================*/
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

const findPropAndPushArr = async (user_prop, prop, user_arr, item) => {
	// const rawQ = `UPDATE users SET downlines = ( SELECT JSON_ARRAY_INSERT(downlines, '$[1000000]', 'aganda') ) WHERE users._id = '633a0b6e09e08abb3b49895c';`
	const query = `UPDATE users SET ${user_arr} = ( SELECT JSON_ARRAY_INSERT(${user_arr}, '$[1000000]', :item) ) WHERE users.${user_prop} = :id`

	const [results, metadata] = await sequelize.query( query, {
		replacements: { item: `${item}`, id: `${prop}` }
	});
	if (results.changedRows) {
		return true
	}else {
		return false
	}
}
console.log(findPropAndPushArr)

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
},{
	hooks: {
		afterCreate: (trn) => {
			// console.log('trn created by', trn.user_name, 'arg', trn._id, trn.New_balance)
			User.update({balance: trn.New_balance},{where:{user_name: trn.user_name}})
			.then(user => {
				console.log('-----------------------------------------------here')
				findPropAndPushArr('user_name', trn.user_name, 'transactions', trn._id)
			})
			.catch(err => {console.log(err) })
		}
	}
})



// User.hasMany(Transaction);
// Transaction.belongsTo(User)

sequelize.sync({force: false})
	.then(() => {console.log('Users and transaction ready') })
	.catch(err => {console.log(err) })

// // return console.log(Transaction)

// User.sync({force: false})
// 	.then(() => {console.log('Users ready') })
// 	.catch(err => {console.log(err) })

// Transaction.sync({force: false})
// 	.then(() => {console.log('Transactions ready') })
// 	.catch(err => {console.log(err) })

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



module.exports = { User, Transaction, create_transaction }