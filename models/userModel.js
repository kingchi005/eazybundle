const {User} = require('./utileModel');
const {Transaction} = require('./utileModel');
const bcrypt = require('bcrypt')




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
		let addedUpline = await findPropAndPushArr(urUpline._id, 'downlines', user_name)
		if (addedUpline) {
			let notified = await findPropAndPushArr(urUpline._id, 'notifications', notify)
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

// findPropAndPushArr('user_name','Grace Uhe', 'notifications', 'it is done oo now i can update arrays')
// 	.then(res => {console.log(res) })
// 	.catch(err => {console.log(err) })
module.exports = { add_upline, User_login, findPropAndPushArr, parseUser }