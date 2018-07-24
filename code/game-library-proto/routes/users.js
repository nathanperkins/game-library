const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

routes.get('/', (req, res) => {
    const data = {
        page_title: 'Users',
    };

    connection.query(queries.get_all_users, (err, rows, fields) => {
        if (err) throw err;

        data.rows = rows;
        res.render('users/index', data);
    });
});

routes.get('/new/', (req, res) => {
    const data = {
        page_title: 'Registration',
        msg: null,
    };

    res.render('users/new', data);
});

routes.get('/login/', (req, res) => {
    const data = {
        page_title: 'Registration',
        msg: null,
    };

    res.render('users/login', data);
});

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

module.exports = routes;