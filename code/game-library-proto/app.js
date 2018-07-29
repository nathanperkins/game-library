const express = require('express');
const app = express();

// using bcrypt to hash and compare passwords
// from https://medium.com/@holtkam2/add-user-authentication-to-your-node-expressjs-application-using-bcrypt-81bb0f618ab3
const bcrypt = require('bcrypt');

// check for config.js
// from https://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js/4482701
const fs = require('fs');
if (!fs.existsSync('./config.js')) {
    throw('./config.js does not exist. Please prepare from config.js.template.');
}

const config = require('./config');
const routes = require('./routes/root');

// using the ejs template engine
app.set('view engine', 'ejs');

// use express-sessions
const session = require('express-session');
app.use(session({
    secret: config.session.password,
    resave: false,
    saveUninitialized: false,
}));


// add express-messages
// usage: req.flash('danger', 'error: user not found');
// message types found here: https://bulma.io/documentation/components/message/
// docs: https://github.com/expressjs/express-messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// add body-parser
// from https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); 

// add session to context
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

// serve static files in the ./public folder
app.use(express.static('public'));
app.use('/', routes);

// start server using port from config
app.listen(config.app.port, config.app.address, () => console.log(`${config.app.name} started at http://${config.app.address}:${config.app.port}/`));