var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var Handlebars = require('handlebars');
var expressHbs = require('express-handlebars')
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);


var { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

mongoose.connect('mongodb://localhost:27017/edoctor',{ useNewUrlParser: true,useUnifiedTopology: true})
.then(() => console.log('connected to database..'))
.catch(err => console.log('Refuse to connect..',err));
var Booking = require("./models/booking");
var newdoctor = require("./models/addDoctors");
var patient = require('./models/patient');
var consult = require('./models/consult')

require('./config/passport1');

// require('./config/passport2');
// require('./config/passport3');


var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var doctorRouter = require('./routes/doctor');
var patientRouter = require('./routes/patient');


var app = express();



// view engine setup
app.engine('.hbs',expressHbs({defaultLayout:'layout',handlebars: allowInsecurePrototypeAccess(Handlebars), extname:'.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(validator());
app.use(session({
  secret: 'mysupersecret',
  resave: false, 
  saveUninitialized: false,
  store:new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 *  60  * 1000}
 }));
 app.use(passport.initialize());
 app.use(passport.session());
 app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


// TO get local variable all over the view
app.use((req, res, next)=>{
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session
  next();
});





app.use('/patient', patientRouter);
app.use('/doctor', doctorRouter);
app.use('/admin', adminRouter);
app.use('/', indexRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
