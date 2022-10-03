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
		set() {
      this.setDataValue('_id', generateMongoObjectId());
    }
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



	module.exports = { Transaction, /*add_upline, User_login, findByIdAndPushArr, parseUser*/ }