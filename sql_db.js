// const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.sql_database, process.env.sql_user, process.env.sql_password, {
  host: process.env.sql_hos,
  dialect: 'mysql'
});
// const pool = mysql.createPool({
// 	host: process.env.sql_host
// 	,user:process.env.sql_user
// 	,password:process.env.sql_password
// 	,database:process.env.sql_database
// }).promise()




// 	pool.query("SELECT * FROM users")
// 		.then(res => {
// 			const [rows] = res;
// 			let user = parseUser(rows[0])
// 			console.log(user.bank_details)
// 		})
// 		.catch(err => {
// 		  console.log(err)
// 		})



const parseUser = rawUser => {
	const {_id, user_name, email, password, phone, balance, ref_id, upline, createdAt, notifications, downlines, transactions, trn_bonus, ref_bonus, bank_details} = rawUser
	const user = {
		_id
		,user_name
		,email
		,password
		,phone
		,balance
		,ref_id
		,upline
		,createdAt
		,notifications: JSON.parse(notifications)
		,downlines: JSON.parse(downlines)
		,transactions: JSON.parse(transactions)
		,trn_bonus
		,ref_bonus
		,bank_details: JSON.parse(bank_details)
	}
	// let d = JSON.parse(rows[0].bank_details)
	return user
}

module.exports = {sequelize}