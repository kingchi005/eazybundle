const { Sequelize, DataTypes } = require('sequelize');
const Transaction = require('./transactionModel');
const {sequelize} = require('../sql_db');
const bcrypt = require('bcrypt')


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


// User.hasMany(Transaction);
// Transaction.belongsTo(User)

// sequelize.sync({force: true})
// 	.then(() => {console.log('Users and transaction ready') })
// 	.catch(err => {console.log(err) })

// return console.log(Transaction)

User.sync({force: true})
	.then(() => {console.log('Users ready') })
	.catch(err => {console.log(err) })


// USER PARSER
const parseUser = rawUser => {
	const {_id, user_name, email, password, phone, balance, ref_id, upline, createdAt, updatedAt, notifications, downlines, transactions, trn_bonus, ref_bonus, bank_details} = rawUser
	const user = {
		_id
		,user_name
		,email
		,password
		,phone
		,bank_details: JSON.parse(bank_details)
		,balance
		,trn_bonus
		,ref_bonus
		,ref_id
		,upline
		,notifications: JSON.parse(notifications)
		,downlines: JSON.parse(downlines)
		,transactions: JSON.parse(transactions)
		,createdAt
		,updatedAt
	}
	// let d = JSON.parse(rows[0].bank_details)
	return user
}



const add_upline = async (user) => {
	const {_id, user_name, upline} = user

	// const user = await User.findByPk(users._id)
	const notify = `Congratulations! Your downline ${user_name} has successfully registered. |${Date.now()}`


	if (!upline) return 'this user has no upline'
	const urUpline = await User.findOne({ where: { ref_id: upline } });
	if (!urUpline) return 'this user has no upline'
	if (urUpline) {
		let addedUpline = await findByIdAndPushArr(urUpline._id, 'downlines', user_name)
		if (addedUpline) {
			let notified = await findByIdAndPushArr(urUpline._id, 'notifications', notify)
			if (notified) {
				console.log('upline notified')
			}
			return 'Upline added'
		}
	}
}

/*User.findOne({ where: { ref_id: 'puxdiv' } })
	.then(upline => {
User.update({downlines: [...upline.downlines, 'again'] }, {
	where: { ref_id: 'puxdiv' }
})
	})
// User.findOne({ where: { ref_id: 'agu4f8' } })
// 	.then(user => {
// 		let arr = JSON.parse(user.downlines)
// 		arr.push('me and u')
// 		user.downlines = JSON.stringify(arr)
// 		user.changed('downlines', true)
// 		user.save()
// 	})
*/


const User_login = async (user_name, password) => {
	const user = await User.findOne({where: { user_name }})
	if (user) {
	  const authenticUser = await bcrypt.compare(password, user.password);
	  if (authenticUser) {
	    return user;
	  }
	  throw Error('Incorrect password');
	}
	throw Error('Incorrect email')
}


const findByIdAndPushArr = async (user_id, user_arr, item) => {
	// const rawQ = `UPDATE users SET downlines = ( SELECT JSON_ARRAY_INSERT(downlines, '$[1000000]', 'aganda') ) WHERE users._id = '633a0b6e09e08abb3b49895c';`
	const query = `UPDATE users SET ${user_arr} = ( SELECT JSON_ARRAY_INSERT(${user_arr}, '$[1000000]', :item) ) WHERE users._id = :id`

	const [results, metadata] = await sequelize.query( query, {
		replacements: { item: `${item}`, id: `${user_id}` }
	});
	if (results.changedRows) {
		return true
	}else {
		return false
	}
}

// findByIdAndPushArr('633a0b6e09e08abb3b49895c', 'notifications', 'it is done oo now i can update arrays')
// 	.then(res => {console.log(res) })
// 	.catch(err => {console.log(err) })

module.exports = { User, add_upline, User_login, findByIdAndPushArr, parseUser }