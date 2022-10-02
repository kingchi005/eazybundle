const Joi = require('joi');


const validator = (schema) => (payload) =>
	schema.validate(payload, {abortEarly: false});


const signupSchema = Joi.object({
	email: Joi.string().email().message('Please enter a valid email').lowercase().required().messages({'string.empty': 'Email is required'})
	,user_name: Joi.string().required().messages({'string.empty': 'User name is required'})
	,upline: Joi.string().allow('').optional()
	,password: Joi.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message('Password not strong')
		.min(6).message('Password length must be at least 6 characters long').required().messages({'string.empty': 'Password is required'})
});


const signinSchema = Joi.object({
	user_name: Joi.string().required().messages({'string.empty': 'User name is required'})
	// ,email: Joi.string().email().required()
	,password: Joi.string().min(6).message('Password length must be at least 6 characters long').required().messages({'string.empty': 'Password is required'})
});


module.exports = {signinSchema, signupSchema}