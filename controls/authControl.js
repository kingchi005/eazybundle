// const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const validateSignup = require('../controls/validator');

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



/*=================--------------------------**USER FUNCTION**--------------------=============================*/
const {formatDistanceToNow, subDays, format} = require('date-fns');
const { FormatMoney } = require('format-money-js');


const fm = new FormatMoney({decimals: 2 });



// JOI SCHEMAS--------------------------
const signupSchema = Joi.object({
	email: Joi.string().email().required()
	,user_name: Joi.string().required()
	,upline: Joi.string().allow('').optional()
	,password: Joi.string().min(6).required()
});

const signinSchema = Joi.object({
	user_name: Joi.string().required()
	// ,email: Joi.string().email().required()
	,password: Joi.string().required()
});







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
	if (err.message.includes('User validation failed')) {
		Object.values(err.errors).forEach(({properties}) => {
			errors[properties.path] = properties.message;
		})
	}
 return errors;
}

//Controller (sign up)
const control_signup = async (req, res) => {
	const {error, value} = signupSchema.validate(req.body,{abortEarly: false})
	if (error) return console.log(error);

	let {user_name, email, upline, password} = value;
	let new_user = {
		_id: generateMongoObjectId(),
		user_name,                                                                                                      
		email,                                                                                               
		password,                                                                                                  
		phone: '0000000',                                                                                                     
		balance: '0',                                                                                                           
		ref_bonus: '0',                                                                                                           
		trn_bonus: '0',                                                                                                           
		transactions: [],                                                                                                                        
		bank_details: {                                                                                                           
		  Name: '',                                                                                     
		  account_number: null,                                                                                           
		  bank_name: ''                                                                                                
		},                                                                                                                        
		ref_id: genRef(),                                                                                                       
		upline,                                                                                                     
		downlines: [],
		notifications: [],
	}
console.log(new_user)

		// creat a new uer in the database
		// if new uer created add him to his upline's downlines and add to his upline's notifications

	try {
		let user = await User.create(new_user)
		// const token = createToken(user._id)
    // res.cookie('eb_nU', token, {httpOnly: true, maxAge: maxAge*1000});
		res.status(201).json({message: 'Account created successfully', type: 'success', user: user._id})
	} catch(e) {
		let errors = handleError(e);
		res.status(400).json({errors})
		// console.log(e);
	}
	// console.log(user);
}

//Controller (Log in)
const control_login = async (req, res) => {
	const {error, value} = signinSchema.validate(req.body, {abortEarly: false})
	if (error) return console.log(error);
	const {user_name, password} = value;

	console.log(value)


	// log the user in asap


	try {
		const user = await User.login(user_name, password);
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