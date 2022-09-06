const User = require("../models/userModel");
const {Transaction, create_transaction} = require("../models/transactionModel");
const {select_plan} = require('../models/pricing');


/*const create_trn = async (req,res) => {
	//perform some authentication
	
	let trn = await create_transaction(req.body);
	res.status(trn.status).json({message:trn.message, type:trn.type});
}*/


//get the price of select data plan
const get_price = (req, res) => {
	const {network, plan} = req.body;
  let pricing = select_plan(network, plan)
  res.status(200).json({pricing})
}


const process_transaction = async (req, res, next) => {
	const id = req.params.id;
	const {network, plan_id, number, amount, Description} = req.body;
	const user = await User.findById(id);
	if (!user) {
  	res.redirect('/')
		// return res.status(403).send('who the heck are you')
	}

	let availble_balance = user.balance;
	if (availble_balance < amount) {
		return res.status(417).json({error: 'Insufficient balance', message: 'You have insufficient balance to continue this transaction, Please fund your wallet and continue', type: 'info'})
	}
	//REQUEST TO THIRD PARTY API
	res.locals.user = user;
	next();
}


const proceed_puchase_data = async (req, res) => {
	const {user} = res.locals;
	const {network, plan_id, number, amount, Description} = req.body;
	let trn_req_granted = /*make_transaction_request()*/ true;
	if (trn_req_granted) {
		// if third party made the transaction
		let New_balance = user.balance - amount;
		let trn = {user_name: user.user_name ,Type:network ,Description ,Amount:amount ,Phone:number ,Previous_balance: user.balance ,New_balance }
		let created_trn = await create_transaction(trn);
		res.status(created_trn.status).json({message:created_trn.message, type:created_trn.type, transaction_details: created_trn.details});
	}else {
		res.status(501).json({error: {message: 'Something went wrong please contact the Admin for your support', type: 'danger'}})
	}   
};


module.exports = {
	// create_trn,
	process_transaction,
	get_price,
	proceed_puchase_data,
}