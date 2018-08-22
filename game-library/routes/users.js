const routes   = require('express').Router();
const passport = require('passport');

const User        = require('../models/users');
const GameRequest = require('../models/game_requests');

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
        page_description: "Users description here",
        table_name  : "users",
        pretty_name : "User",
        new_endpoint: "/users/new/",
        update: false,
    }

    User.getAll( {}, (err, rows, fields) => {
        if (err) throw err;

        context.rows   = rows;
        context.fields = [
            {name: 'id',         pretty: 'ID'},
            {name: 'last_name',  pretty: 'Last Name'},
            {name: 'first_name', pretty: 'First Name'},
            {name: 'email',      pretty: 'Email'},
            {name: 'role',       pretty: 'Role'},
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
routes.post('/login', 
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/users/login/',
                                     failureFlash: 'Invalid username or password.',
                                     successFlash: 'Welcome!' })
);

routes.get('/logout', (req, res) => {
    req.logout();

    res.redirect('/');
});

routes.get('/profile/', (req, res) => {
    const data = {
        page_title: 'User Profile',
    };

    if ( !req.user ) {
        res.redirect('/users/login');
        return;
    }

    const user_id = req.user.id;

    User.get({id: user_id}, (err, user, fields) => {
        if (err) throw err;

        data.user = user;
        
        GameRequest.getAllByUser({ user_id }, (err, requests, fields) => {
            if (err) throw err;
        
            data.requests_pending     = requests['pending'];
            data.requests_checked_out = requests['checked_out'];
            data.requests_completed   = requests['completed'];

            res.render('users/profile', data);
        });
    });
});

routes.get('/:user_id/promote/', (req, res) => {
    User.get({id: req.params.user_id}, (err, user) => {
        if (err) {
            req.flash('danger', err.message);
            res.redirect('/');
            return;
        }

        User.update({id: user.id, role: 'admin'}, (err, user) => {
            if (err) {
                req.flash('danger', err.message);
            }
            else {
                req.login(user, err => {
                    if (err) 
                        req.flash('danger', err.message);
                    else
                        req.flash('success', `${user.email} was promoted to ${user.role}`);
                })
                res.redirect('/');
            }
        });
    });
});

routes.get('/change_password/',
    (req, res) => {
    if (!req.user) {
        req.flash('warning', 'You must be logged in for that.');
        res.redirect('/users/login');
        return;
    }

    const data = {
        page_title: 'Change Password',
    };

    res.render('users/change_password', data);
});

routes.patch('/change_password', [
    body('new_password').isLength({min: 8})
    ], (req, res) => {
    
    const errors = validationResult(req);

    if (!req.user) {
        req.flash('warning', 'You must be logged in for that.');
        res.redirect('/users/login');
        return;
    }
    
    if (req.body.current_password === '' || req.body.new_password === '' || req.body.new_password_confirm === '') {
        req.flash('warning', 'You must provide your current password and the new password plus confirmation.');
        res.redirect('/users/change_password');
        return;
    }

    if (req.body.new_password !== req.body.new_password_confirm) {
        req.flash('warning', 'The new password and password confirmation must match.');
        res.redirect('/users/change_password');
        return;
    }

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('warning', error.msg);
        })
        res.redirect('/users/change_password');
        return;
    }

    User.login({email: req.user.email, password: req.body.current_password}, (err, user) => {
        if (err) {
            req.flash('danger', err.message);
            res.redirect('/users/change_password');
            return;
        }

        User.updatePassword({id: user.id, password: req.body.new_password}, (err, user) => {
            if (err) {
                req.flash('danger', err.message);
                res.redirect('/users/change_password');
                return;
            }

            req.flash('success', 'Your password has been changed!');
            res.redirect('/users/profile');
        });
    });
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
            req.flash('danger', `${error.param} error: ${error.msg}`);
        });

        res.render('users/new', data);
        return;
    }

    User.create({
        first_name : req.body.first_name,
        last_name  : req.body.last_name,
        email      : req.body.email,
        password   : req.body.password,
        role       : "user",
    }, (err, user) => {
        if (err) {
            req.flash('danger', err['msg'] || err['sqlMessage']);
            res.redirect('/users/new/');
            return;
        }

        req.login(user, err => {
            if (err) throw err;
            req.flash('success', `Welcome ${user.first_name} ${user.last_name}!`);
            res.redirect('/');
        });
    });
});

module.exports = routes;