const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const {isEmail} = require('validator');

const Schema = mongoose.Schema;

const userSchema = Schema({
	user_name: {
	    type: String,
	    required: [ true, 'User name is required' ],
	    unique: true
	  },
	  email: {
	    type: String,
	    required: [ true, 'Email is required' ],
	    unique: true,
	    lowercase: true,
	    validate: [ isEmail, 'Please enter a valid email' ]
	  },
	  password: {
	    type: String,
	    required: [true, 'Password is required'],
	    minlength: [ 6, 'Minimun password length is 6 characters' ]
	  },
	  phone: { type: Number },
	  balance: { type: Number },
	  ref_bonus: { type: Number },
	  trn_bonus: { type: Number },
	  transactions: [String],
	  bank_details: {
	    Name: { type: String },
	    account_number: { type: Number },
	    bank_name: { type: String }
	  },
	  ref_id: { type: String },
	  upline: { type: String },
	  downlines: [String],
	  notifications: [String],
}, { timestamps: true })

//Generate refID
const genRef = () => `${Math.random().toString(36).substr(6,6)}`;

//Hash user password
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  this.ref_id = genRef();
  next();
})

//if Refferer
userSchema.post('save', async function (doc,next) {
	const notify = `Congratulations! Your downline ${doc.user_name} has successfully registered.`
	const new_downline = this.user_name;
	const urUpline = await User.updateMany({ref_id: this.upline}, {$push: {downlines: this.user_name, notifications: notify}})
	if (urUpline) {
		console.log('upline added');
		next();
	}
})

//User Login Method
userSchema.statics.login = async function (user_name, password) {
  const user = await this.findOne({user_name});
  if (user) {
    const authenticUser = await bcrypt.compare(password, user.password);
    if (authenticUser) {
      return user;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email')
}

const User = mongoose.model('User', userSchema)
module.exports = User;