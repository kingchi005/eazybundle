const {User} = require('../models/utileModel');
const bcrypt = require('bcrypt');

//Password settings
const update_password = async (req, res) => {
	let {old_password, new_password} = req.body;
	const user = await User.findByPk(req.params.id);
	if (user) {
	  const old_password_iscorrect = await bcrypt.compare(old_password, user.password);
	  
	  if (old_password_iscorrect) {
		  if (new_password.length < 6) return res.status(500).json({message: 'Password must have minimum of 6 characters', type: 'danger'})
	  	let password_updated = await User.update(
		  		{ password: new_password },
		  		{ where: {_id: user._id }
				});
		  if (password_updated) {
			  return res.status(200).json({message: 'Password updated successfully', type: 'success'});
		  }
		  return res.status(500).json({message: 'An error occurd please try again in few minutes', type: 'danger'});
	  }
	  return res.status(500).json({message: 'Incorrect old password', type: 'danger'});
	}
  res.status(500).json({message: `User not found`, type: 'danger'});
}

//Add bank details
const update_bank = async (req,res) => {
	const {Name, account_number, bank_name} = req.body;
	if (account_number.length < 10 || bank_name == '' || Name == '') {
		res.status(400).json({message: 'Please enter your bank details', type: 'danger'});
		return;
	}
	const bankDetails = await User.update({
		bank_details: {
	    Name
	    ,account_number
	    ,bank_name
	  }
	}, {where: {_id: req.params.id}});
	if (bankDetails) {
		res.status(200).json({message: 'Your bank details has been updated successfully', type: 'success'});
		return
	}
	res.status(400).json({message: 'Oops!! an error occured', type: 'danger'});
}

//Add a phone number
const update_phone = async (req,res) => {
	const {phone_number} = req.body;
	const user_phone = await User.update({phone: phone_number },{where: {_id: req.params.id}});
	if (user_phone) {
		res.status(200).json({message: 'Your phone number has been updated successfully', type: 'success'});
		return
	}
	res.status(400).json({message: 'Oops!! an error occured', type: 'danger'});
}

module.exports = {
	update_password,
	update_bank,
	update_phone,
}