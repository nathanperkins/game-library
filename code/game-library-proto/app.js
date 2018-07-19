const express = require('express');
const app = express();
const mysql = require('mysql');

// bodyParser is used to extract parameters from a POST request
// from https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
const queries = require('./queries');
const connection = mysql.createConnection(config.db);

// keep db connection alive by making a query every 10 seconds
// https://stackoverflow.com/a/28215691/8092467
setInterval(function () {
    connection.query('SELECT 1');
}, 10000);

// using the ejs template engine
app.set('view engine', 'ejs');

// serve static files in the ./public folder
app.use(express.static('public'))

app.get('/', (req, res) => {

    const data = {
        page_title: 'Root',
    };

    // renders views/index.ejs, passing in data for use in the template
    res.render('index', data);
});

app.get('/library/', (req, res) => {
    const data = {
        page_title : 'Library',
        search     : null, 
    };

    let search = `%`;

    if (req.query.title) {
        search = `%${req.query.title}%`;
        data.search = req.query.title;
    }

    connection.query(queries.get_all_game_releases_with_search, [search, search], (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('library/index', data);
    });
});

app.get('/game_requests/', (req, res) => {
    const data = {
        page_title: 'Requests',
    };

    connection.query(queries.get_all_game_requests, (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('game_requests/index', data);
    });
});

app.get('/users/', (req, res) => {
    const data = {
        page_title: 'Users',
    };

    connection.query(queries.get_all_users, (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('users/index', data);
    });
});

app.get('/register/', (req, res) => {
    const data = {
        page_title: 'Registration',
        msg: null,
    };

    res.render('users/new', data);
});

app.get('/login/', (req, res) => {
    const data = {
        page_title: 'Registration',
        msg: null,
    };

    res.render('users/login', data);
});

app.post('/users', [
        // validations from express-validator
        body(['first_name', 'last_name']).trim()
        .isAlpha('en-US').withMessage('must be alpha characters only'),
        body('email').trim()
        .isEmail().withMessage('must be a valid email')
        .normalizeEmail(),
        body('password').trim()
        .isLength({ min: 8 }).withMessage('must be a minimum of 8 characters'),
    ], (req, res) => {
    const errors = validationResult(req);

    const data = {
        page_title: 'Registration',
        errors: errors.array(),
    };

    if (!errors.isEmpty()) {
        res.render('users/new', data);
    } else {

        // create a hash from the password
        bcrypt.hash(req.body.password, 10, (err, hash) => {

            // parameters for insert query
            const newUser = [
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                hash,
            ]

            connection.query(queries.insert_new_user, newUser, (err, rows) => {
                if (err) throw err;

                res.redirect('/users/');
            });
        });
    }
});

app.get('/game_requests/new/', (req, res) => {
    const data = {
        page_title  : 'Library',
        msg         : `Added request for release_id: ${req.query.release_id}`,
        search      : null,
    };

    connection.query(queries.get_all_game_releases_with_search, ['%', '%'], (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('library/index', data);
    });
});

app.get('/admin/', (req, res) => {
    const data = {
        page_title  : 'Admin',
        errors      : null,
        msg         : null,
    };

    res.render('admin/index', data);
});

app.get('/game_titles/new', (req, res) => {
    const data = {
        page_title  : 'New Game Title',
        errors      : null,
        msg         : null,
    };

    res.render('game_titles/new', data);
});

app.get('/game_platforms/new', (req, res) => {
    const data = {
        page_title  : 'New Game Platform',
        errors      : null,
        msg         : null,
    };

    res.render('game_platforms/new', data);
});

app.get('/game_releases/new', (req, res) => {
    const data = {
        page_title  : 'New Game Release',
        errors      : null,
        msg         : null,
    };

    res.render('game_releases/new', data);
});

app.get('/game_copies/new', (req, res) => {
    const data = {
        page_title  : 'New Game Copy',
        errors      : null,
        msg         : null,
    };

    res.render('game_copies/new', data);
});

// start server using port from config
app.listen(config.app.port, config.app.address, () => console.log(`${config.app.name} started at http://${config.app.address}:${config.app.port}/`));