const nodemailer = require('nodemailer');
require('dotenv').config();

// const sendMail = arg => {}

module.exports = async (email, subject, message) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			service: process.env.MAIL_SERVICE,
			port: process.env.MAIL_PORT,
			secure: true,
			auth: {
				// user: 'eazybundledata@gmail.com',
				// pass: 'tpmtukkbtspvsauz'
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS
			}
		})

		let info = await transporter.sendMail({
			from: process.env.MAIL_USER,
			to: email,
			subject: subject,
			text: message
		})

		return {message:'Email sent successfully', type: 'success', mail: info.response}
	} catch(e) {
		console.log(e);
		return {error: {message:e.message, type: 'danger'}}
	}
}