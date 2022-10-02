const { Sequelize, DataTypes } = require('sequelize');
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

User.sync({force: false})
	.then(() => {console.log('Users ready') })
	.catch(err => {console.log(err) })


const add_upline = async (user_id, upline_ref) => {
	if (!upline_ref) return 'this user has no upline'
	const upline = await User.findOne({ where: { ref_id: upline_ref } });
	if (!upline) return 'this user has no upline'
	if (upline) {
		User.update({})
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


module.exports = { User, add_upline, User_login }