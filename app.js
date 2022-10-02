const express = require('express');
// const enforce = require('express-sslify');
// const mongoose = require('mongoose');
require('dotenv').config();

//Routes
const apiRoutes = require('./routes/apiRoutes');
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const cookieParser = require('cookie-parser');
const {fetch_current_user} = require('./controls/authControl');


const {formatDistanceToNow, subDays, format} = require('date-fns');
const { FormatMoney } = require('format-money-js');
const fm = new FormatMoney({decimals: 2 });


const app = express();

//middleware
// app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

//view engine
app.set('view engine', 'ejs');

//database connection
dbURI = process.env.DB_URI;
// const hostname = '192.168.43.19'
const hostname = '127.0.0.1';
const PORT = process.env.PORT;
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: true })
  // .then((result) => {
		app.listen(PORT, () => {console.log('----------------------------------------------------------\nserver started visit',`${hostname}:${PORT}\n----------------------------------------------------------`) })
  // console.log('DB connected');
  // })
  // .catch((err) => console.log(err));

//routes
app.get('*', fetch_current_user);
app.get('/', (req, res) => {
	res.render('home', {title: 'Get cheap data', page: 'home', formatDistanceToNow, fm})
});

app.use(authRoutes)
app.use(pageRoutes)
app.use(profileRoutes)
app.use(transactionRoutes)
app.use('/api', apiRoutes)

//404 page
app.use((req,res) => {
	let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	console.log(fullUrl);
	res.status(404).render('404-page', {title: 'page not found', page:fullUrl})
})