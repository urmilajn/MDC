const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
//const config = require('./config/database');
const httpPort = 9000;

/*//DB related
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect(config.database);    //getting url from config/database.js instead of connecting directly
const db = mongoose.connection;*/

//Controllers
const login = require('./routes/login.js');  //validate admin
const dashboard = require('./routes/dashboard.js');  //Get all customers
const customer = require('./routes/customer.js');  //Get all customers

//Initial app 
const app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
    secret: 'idmsecret',
    saveUninitialized: true,
    resave: true
}));

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport Config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash -- for flash messages on UI
app.use(flash());

//Global variables
app.get('*', function (req, res, next) {      //set these variables for each incoming "get"
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Global variables
app.post('*', function (req, res, next) {   //set these variables for each incoming "post"
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', login);                //on GET / go to ./routes/login.js which will take you to views/login.handlebars
app.use('/login', login);           //even on GET /login it should behave as aboveS
app.use('/dashboard', dashboard);   //on GET /dashboard go to ./routes/dashboard.js which will take you to views/dashboard.handlebars
app.use('/customer', customer);   //on GET /dashboard go to ./routes/dashboard.js which will take you to views/dashboard.handlebars

//Set Port
app.set('port', process.env.PORT || httpPort);

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + httpPort);
});