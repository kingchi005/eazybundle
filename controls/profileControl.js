const User = require("../models/userModel");
const bcrypt = require('bcrypt');

//Password settings
const update_password = async (req, res) => {
	let {old_password, new_password} = req.body;
	const user = await User.findOne({_id: req.params.id});
	if (user) {
	  const old_password_iscorrect = await bcrypt.compare(old_password, user.password);
	  if (old_password_iscorrect) {
		  const salt = await bcrypt.genSalt();
		  if (new_password.length < 6) {
		  res.status(500).json({message: 'Password must have minimum of 6 characters', type: 'danger'});
		  return;
		  }
		  let new_hashed = await bcrypt.hash(new_password, salt);
		  let password_updated = await User.findByIdAndUpdate({_id: req.params.id}, {$set: {password: new_hashed}});
		  if (password_updated) {
			  res.status(200).json({message: 'Password updated successfully', type: 'success'});
		  return;
		  }
		  res.status(500).json({message: 'An error occurd please try again in few minutes', type: 'danger'});
		  return;
	  }
	  res.status(500).json({message: 'Incorrect old password', type: 'danger'});
	  return;
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
	const bankDetails = await User.findByIdAndUpdate({_id: req.params.id}, {
		$set: {
			bank_details: {
		    Name
		    ,account_number
		    ,bank_name
		  }
		}
	});
	if (bankDetails) {
		res.status(200).json({message: 'Your bank details has been updated successfully', type: 'success'});
		return
	}
	res.status(400).json({message: 'Oops!! an error occured', type: 'danger'});
}

//Add a phone number
const update_phone = async (req,res) => {
	const {phone_number} = req.body;
	const user_phone = await User.findByIdAndUpdate({_id: req.params.id}, {
		$set: {
			phone: phone_number
		}
	});
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