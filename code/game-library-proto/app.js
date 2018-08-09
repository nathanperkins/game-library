const fs = require('fs');

if (!fs.existsSync("config/default.json")) {
    console.log("Error: config/config.json has not been configured.\n",
                "Please copy default.json.template to default.json\n",
                "and modify as necessary.\n");

    process.exit(1);
}

const express = require('express');
const app = express();

global.__basedir = __dirname;

// using bcrypt to hash and compare passwords
// from https://medium.com/@holtkam2/add-user-authentication-to-your-node-expressjs-application-using-bcrypt-81bb0f618ab3
const bcrypt = require('bcrypt');

const config = require('config');
app.set('port', config.app.port);
app.set('address', config.app.address);
app.set('base_url', `http://${app.get('address')}:${app.get('port')}`)

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

// add body-parser
// from https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); 

// serve static files in the ./public folder
app.use(express.static('public'));

// use method-override for using RESTFul routes with HTML forms
// https://www.npmjs.com/package/method-override
const methodOverride = require('method-override');
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// custom middleware
app.use(function (req, res, next) {

    res.locals.messages = require('express-messages')(req, res);
    res.locals.session  = req.session;
    res.locals.app_name = config.app.name;
    next();
  });

app.use('/', routes);

// start server using port from config
app.listen(app.get('port'), app.get('address'), () => console.log(`${config.app.name} started at ${app.get('base_url')}/`));

module.exports = app;