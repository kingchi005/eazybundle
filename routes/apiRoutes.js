const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.json({message: 'this is an api router'})
})

router.post('/signup', (req, res) => {
	const {user_name, email, password, upline} = req.body;
	// console.log(req.body);
})


module.exports = router;