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
				findPropAndPushArr('user_name', trn.user_name, 'transactions', trn._id)
			})
			.catch(err => {console.log(err) })
			// promo hook
/*			if (trn.Type === 'MTN SME' || trn.Type === 'Airtel Data') {
					let bonus_amount;
					if (trn.Description === '3GB for 30days #1000' && trn.Amount === 1000) {
*/
			if (trn.Type === 'respontesting Data' || trn.Type === 'Airtel Data') {
					let bonus_amount;
					if (trn.Description === '3.5GB for 30days #1900' && trn.Amount == 1900) {

						bonus_amount = 100
					} else if (trn.Description === '5GB for 30days #1600' && trn.Amount == 1600) {
						bonus_amount = 200
					} else if (trn.Description === '10GB for 30days #3000' && trn.Amount == 3000) {
						bonus_amount = 450
					} else {
						return
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
						    mobile_number: `0${trn.Phone}`,
						    Ported_number: true,
						    airtime_type: "VTU"
						})
					};

					axios(config)
					.then(response => {
					  // console.log(JSON.stringify(response.data));
					  
						if(response.data.Status === 'successful') {
					// =================--------------------------**TESTING**--------------------=============================
					// User.findByPk('633c46626ae48706c0596bbc')
					// 	.then(response => {
					// 	  if(true) {
					//   		let trnx = {
					//   			user_name: trn.user_name
					//   			,_id: generateMongoObjectId()
					//   			,Type:`Bonus`
					//   			,Description: 'Airtime bonus'
					//   			,Amount:bonus_amount
					//   			,cost_price: bonus_amount
					//   			,Phone: null
					//   			,Previous_balance: trn.balance
					//   			,New_balance: trn.balance
					//   		}
					// =================--------------------------**TESTING**--------------------=============================
							let trnx = {
								user_name:trn.user_name
								,Type: `Bonus`
								,Description: 'Airtime Bonus'
								,Amount: bonus_amount
								,cost_price: response.data.paid_amount
								,Phone: response.data.mobile_number
								,Previous_balance: trn.balance
								,New_balance: trn.New_balance
							}
							create_transaction(trnx)
								.then(created_trn => {
									if (created_trn.status === 202) {
										const notify = `Congratulation! You received a transaction bonus of NGN ${created_trn.details.Amount} in form of airtime to 0${created_trn.details.Phone}. Purchase more data bundle to receive airtime bonus |${Date.now()}`

										findPropAndPushArr('user_name', created_trn.details.user_name, 'notifications', notify)
										User.increment('trn_bonus', { by: created_trn.details.Amount, where: { user_name: created_trn.details.user_name }})
										// User.update({trn_bonus:created_trn.details.Amount},{
										// 	where: {user_name: created_trn.details.user_name}
										// })
									}
									return
								})
								.catch(error => {
									console.log(error)
								});
						}
					})
					.catch(err => {
						console.log(err)
					})
				} else {
					// console.log(error)
				}
		},

	}
})



// User.hasMany(Transaction);
// Transaction.belongsTo(User)

sequelize.sync({alter: true})
	.then(() => {console.log('Users and transaction ready') })
	.catch(err => {console.log(err) })

// // return console.log(Transaction)

// User.sync({force: false})
// 	.then(() => {console.log('Users ready') })
// 	.catch(err => {console.log(err) })

// Transaction.sync({force: false})
// 	.then(() => {console.log('Transactions ready') })
// 	.catch(err => {console.log(err) })

async function create_transaction(transaction_details) {
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