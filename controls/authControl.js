const {User, add_upline, User_login} = require("../models/userModel");
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// const cookieParser = require('cookie-parser');
const secreTokenKey = process.env.STK

//Generate AuthToken
const maxAge = 24*60*60;
const createToken = id => jwt.sign({id}, secreTokenKey, {expiresIn: maxAge});
const genRef = () => `${Math.random().toString(36).substr(6,6)}`;

// mongodb _id generator
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
const securePass = pass => pass



/*=================--------------------------**USER FUNCTION**--------------------=============================*/
const {formatDistanceToNow, subDays, format} = require('date-fns');
const { FormatMoney } = require('format-money-js');


const fm = new FormatMoney({decimals: 2 });



// JOI SCHEMAS--------------------------

const {signinSchema, signupSchema} = require('../controls/validator');


//generate refID
// const genRef = () => `${Math.random().toString(36).substr(6,6)}`;

//handle the Errors
const handleError = err => {
  let errors = {user_name: '', email: '', password: ''}

  //Login errors
  if (err.message === 'Incorrect email') {
    errors.user_name = 'Account not found';
  }

  if (err.message === 'Incorrect password') {
    errors.password = 'Incorrect password';
  }

  //Duplicate err code
  if (err.code === 11000 && err.keyPattern.email) {
  	errors.email = 'Email already exists';
  }
  if (err.code === 11000 && err.keyPattern.user_name) {
  	errors.user_name = 'User name not available';
  }

	//User validaiton err
	if (err.validatorKey === 'not_unique') {
		// err.forEach(properties => {
			errors[err.path] = err.message;
		// })
	}
 return errors;
}

//Controller (sign up)
const control_signup = async (req, res) => {
	let errors = {user_name: '', email: '', password: ''}
	const {error, value} = signupSchema.validate(req.body,{abortEarly: false})
	if (error) {
		error.details.forEach(properties => {
			errors[properties.path] = properties.message;
		})
		// return console.log(errors);
		return res.status(400).json({errors})
	}

	let {user_name, email, upline, password} = value;
	let new_user = {
		_id: generateMongoObjectId(),
		user_name,
		email,
		password: securePass(password),
		phone: null,
		bank_details: {
		  Name: '',
		  account_number: null,
		  bank_name: ''
		},
		balance: 0,
		trn_bonus: 0,
		ref_bonus: 0,
		ref_id: genRef(),
		upline,
		notifications: [],
		downlines: [],
		transactions: [],
	}
	// console.log(new_user)


		// creat a new uer in the database
	try {
		const user = await User.create(new_user)
		// console.log(user)
		// const token = createToken(user._id)
    // res.cookie('eb_nU', token, {httpOnly: true, maxAge: maxAge*1000});
		res.status(201).json({message: 'Account created successfully', type: 'success', user: user._id})
		// if new uer created add him to his upline's downlines and add to his upline's notifications
		let ul = await add_upline(user._id, user.upline)
		console.log(ul)
	} catch(e) {
		// console.log(e.errors[0])
		const errors = handleError(e.errors[0]);
		res.status(400).json({errors})
		// console.log(e);
	}
	// console.log(user);
}


//Controller (Log in)
const control_login = async (req, res) => {
	let errors = {user_name: '', email: '', password: ''}	
	const {error, value} = signinSchema.validate(req.body, {abortEarly: false})
	if (error) {
		error.details.forEach(properties => {
			errors[properties.path] = properties.message;
		})
		// return console.log(errors);
		return res.status(400).json({errors})
	}

	const {user_name, password} = value;


	// log the user in asap


	try {
		const user = await User_login(user_name, password);
    const token = createToken(user._id);
    res.cookie('eb_nU', token, {httpOnly: true, maxAge: maxAge*1000});
    res.status(200).json({message: 'Login successful', type: 'success', user: user._id});
	} catch(e) {
    const errors = handleError(e);
    res.status(400).json({errors})
	}
}

//User loggout
const logout_user = (req, res) => {
	res.cookie('eb_nU', 'log out succefful', {maxAge: 1});
	res.redirect('/');
}

//Authenticate User
const requireAuth = (req, res, next) => {
	let token = req.cookies.eb_nU;
	if (token) {
		jwt.verify(token, secreTokenKey, (err, dt) => {
			if (err) {
				res.redirect('/login')
			} else {
				res.locals.fm = fm;
				res.locals.formatDistanceToNow = formatDistanceToNow;
				next();
			}
		})
	} else {
		res.redirect('/login');
	}
}

//Fetch User
const fetch_current_user = (req, res, next) => {
	let token = req.cookies.eb_nU;
	if (token) {
		jwt.verify(token, secreTokenKey, async (err, dt) => {
			if (err) {
				res.locals.user = null;
				next();
			} else {
				let user = await User.findById(dt.id);
				res.locals.user = user;
				res.locals.fm = fm;
				res.locals.formatDistanceToNow = formatDistanceToNow;
				next();
			}
		})
	} else {
		res.locals.user = null;
		next();
	}
}

module.exports = {
	control_signup,
	control_login,
	logout_user,
	requireAuth,
	fetch_current_user,
}