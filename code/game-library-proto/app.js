const fs = require('fs');

if (!fs.existsSync("config/default.json")) {
    console.log("Error: config/config.json has not been configured.\n",
                "Please copy default.json.template to default.json\n",
                "and modify as necessary.\n");

    process.exit(1);
}

const express = require('express');
const app = express();

// using bcrypt to hash and compare passwords
// from https://medium.com/@holtkam2/add-user-authentication-to-your-node-expressjs-application-using-bcrypt-81bb0f618ab3
const bcrypt = require('bcrypt');

const config = require('config');
app.set(config.get('app'));

const routes = require('./routes/root');

// using the ejs template engine
app.set('view engine', 'ejs');

// use express-sessions
const session = require('express-session');
app.use(session({
    secret: config.get('session.password'),
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

module.exports = app;