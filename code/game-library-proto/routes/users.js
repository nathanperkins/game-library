const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// using bcrypt to hash and compare passwords
// from https://medium.com/@holtkam2/add-user-authentication-to-your-node-expressjs-application-using-bcrypt-81bb0f618ab3
const bcrypt = require('bcrypt');

routes. get('/', (req, res) => {
    const context = {
        page_title  : "Users Index",
        table_name  : "users",
        pretty_name : "Users",
    }

    connection.query(queries.get_all_users, (err, rows, fields) => {
        if (err) throw err;

        context.rows   = rows;
        context.fields = [
            'ID',
            'Last Name',
            'First Name',
            'Email',
            'Role',
        ]

        res.render('generic/table', context);
    });
});

routes.get('/new/', (req, res) => {
    const data = {
        page_title: 'Registration',
    };

    res.render('users/new', data);
});

routes.get('/login/', (req, res) => {
    const data = {
        page_title: 'Registration',
    };

    res.render('users/login', data);
});

// login user
routes.post("/login", (req, res) => {
    console.log(req.body);
    
    const email     = req.body.email;
    const password  = req.body.password;

    connection.query(queries.get_user_by_email, [email], (err, rows, fields) => {
        const user = rows[0];

        if (user) {
            delete user.password;
            req.session.user = user;
            req.session.name = `${user.first_name} ${user.last_name}`;
            res.redirect('/');
        } else {
            req.flash('danger', 'Login failed: bad email or password');
            res.redirect('/users/login/');
        }
    });
});

routes.get('/logout', (req, res) => {
    req.session.user = null;

    res.redirect('/');
});

routes.get('/profile/', (req, res) => {
    const data = {
        page_title: 'User Profile',
    };

    const user = req.session.user;

    if (!user) {
        res.redirect('/users/login');
    }
    const user_id = req.session.user.id;

    connection.query(queries.get_user_by_id, [user_id], (err, rows, fields) => {
        if (err) throw err;

        data.user = rows[0];
        
        connection.query(queries.get_game_requests_by_user, [user_id], (err, rows, fields) => {
            if (err) throw err;
        
            data.requests_checked_out = rows.filter(row => row.status === "checked_out");
            data.requests_pending     = rows.filter(row => row.status === "pending");
            data.requests_completed   = rows.filter(row => row.status === "completed");
            data.requests_cancelled   = rows.filter(row => row.status === "completed");

            res.render('users/profile', data);
        });
    });
});

routes.get('/change_password/', (req, res) => {
    const data = {
        page_title: 'Change Password',
        msg: null,
    };

    res.render('users/change_password', data);
});

// create new user
routes.post('/', [
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
    };

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('danger', `${error.param} error: ${error.msg}`)
        });

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

module.exports = routes;