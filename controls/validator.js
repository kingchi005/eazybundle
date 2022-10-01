const Joi = require('joi');


const validator = (schema) => (payload) =>
	schema.validate(payload, {abortEarly: false});


const signupSchema = Joi.object({
	email: Joi.string().email().required()
	,user_name: Joi.string().required()
	,upline: Joi.string().optional()
	,password: Joi.string().min(6).required()
});


const signinSchema = Joi.object({
	user_name: Joi.string().required()
	// ,email: Joi.string().email().required()
	,password: Joi.string().min(6).required()
});


exports.validateSignup = validator(signupSchema)
module.exports.validateSignin = validator(signinSchema)