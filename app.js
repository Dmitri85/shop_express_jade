var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var usersCheck = require("./model/exists_users");
var fs = require('fs');
var router = express.Router();

// var mySql = require('mysql');

// var con = mySql.createConnection({
//     host: 'localHost',
//     user:'root',
//     password: '850429'
// });

// con.connect(function (err){
//     if (err) throw err;
//     console.log('connected!!!');
//     con.query('create database try', function (err, result){
//         if(err) throw err;
//         console.log(result);
//     })
// });


var index = require('./routes/index');
var single = require('./routes/single');
var cart = require('./routes/cart');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
    // check if client sent cookie
    var cookie = req.cookies.cookieName;
    if (cookie === undefined) {
        // no: set a new cookie
        var randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, randomNumber.length);
        res.cookie('cookieName', randomNumber, { maxAge: 900000000, httpOnly: true });
        console.log('cookie created successfully');
    }
    else {
        // yes, cookie was already present 
        console.log('cookie exists', cookie);
    }
    fs.open('./data/usesrs_carts/' + req.cookies.cookieName + '.json', 'wx+', function (err, fd) {
    });
    next();
});
app.use(express.static(path.join(__dirname, 'public')));


//login
// var urlEncodedParser = bodyParser.urlencoded({ extended: false });

// app.use(express.static('public'));
app.use(session({ secret: '123456789abc', cookie: { maxAge: 600000000 } }));

app.post('/user_login', function (req, res, next) {
    var sess = req.session;
    // sess.logged = false;
    var response1 = {
        username: req.body.userName,
        password: req.body.password
    };

    if (usersCheck.ifUserExists(response1)) {
        sess.logged = true;
        sess.userName = req.body.userName;
        res.send({log: sess.logged});
    } else {
        res.send(sess.logged);
    }
});

app.get('/registerNewUser', function(req,res){
    if(usersCheck.ifUserExistsByMail(req.query.userName)){
        res.send('already exists');
    }else{
        var users = JSON.parse(usersCheck.returnUsers());
        var user = {
            id: req.query.userName,
            pass: req.query.pass
        };
        
        users.push(user);
        usersCheck.writeToFile(users);



    }
    res.end();
});

app.post('/isLogged', function(req, res){
    if(req.session.logged){
        res.send({log:req.session.logged, name:req.session.userName});
    }else{
        res.send({log:false});
    }
});

app.use('/single', single);
app.use('/', cart);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// //forgott password
// var nodemailer = require('nodemailer');

// app.use('/sayHello', router);
// router.post('/', handleSayHello); // handle the route at yourdomain.com/sayHello

// function handleSayHello(req, res) {
//     // Not the movie transporter!
//     var transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: 'dmitri85@gmail.com', // Your email id
//             pass: 'IrinaRir2904' // Your password
//         }
//     });
//     var text = 'Hello world from \n\n' + req.body.name;
//     var mailOptions = {
//         from: 'dmitri85@gmail.com>', // sender address
//         to: 'dmitri85@destination.com', // list of receivers
//         subject: 'Email Example', // Subject line
//         text: text //, // plaintext body
//         // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
//     };

// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         console.log(error);
//         res.json({yo: 'error'});
//     }else{
//         console.log('Message sent: ' + info.response);
//         res.json({yo: info.response});
//     };
// });

// }


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
