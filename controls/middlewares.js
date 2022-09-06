const {Transaction} = require("../models/transactionModel");
const {formatDistanceToNow, subDays, format} = require('date-fns');

// const mongoose = require('mongoose');


const fetch_transactions = async (req, res, next) => {
	const {user} = res.locals;
  const trn_id = user.transactions

  // trns = await Transaction.find({}).sort({createdAt: -1});
  let trn = await Transaction.find({ '_id': { $in: trn_id } }).sort({createdAt: -1});
const trns = []
  for(let t of trn) {
  	trns.push({
  		_id: t._id,
		  user_name: t.user_name,
		  Type: t.Type,
		  Description: t.Description,
		  Date: t.createdAt,
		  Amount: t.Amount,
		  Phone: t.Phone,
		  Previous_balance: t.Previous_balance,
		  New_balance: t.New_balance,
  	})
  };

	res.locals.transactions = trns;
	res.locals.functions = {formatDistanceToNow, format}
  next();
};




module.exports = {fetch_transactions}