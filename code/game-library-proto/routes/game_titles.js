const routes = require('express').Router();
const queries = require('../queries');
const connection = require('../db');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

routes. get('/', (req, res) => {
    const context = {
        page_title  : "Game Title Index",
        table_name  : "game_titles",
        pretty_name : "Game Title",
    }

    connection.query(queries.get_all_game_titles, (err, rows, fields) => {
        if (err) throw err;

        context.rows   = rows;
        context.fields = [
            'ID',
            'Name',
            'Genre',
            'Developer',
            'Producer',
        ]

        res.render('game_titles/index', context);

    });
});

routes.get('/new', (req, res) => {
    const context = {
        page_title  : 'New Game Title',
    };

    res.render('game_titles/new', context);
});

routes.post('/', [
        // validations from express-validator
        body(['name', 'description', 'developer', 'producer']).trim()
        .isAscii().withMessage('must be at least one character (ASCII characters only)'),
    ], (req, res) => {
    const errors = validationResult(req);

    const data = {
        page_title: 'Add Title',
    };

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('danger', `${error.param} error: ${error.msg}`);
        });

        res.render('game_titles/new', data);
    } else {
        // parameters for insert query
        const newTitle = [
            req.body.name,
            req.body.description,
            req.body.genre,
            req.body.developer,
            req.body.producer,
        ];

        connection.query(queries.insert_new_title, newTitle, (err, rows) => {
            if (err)
                req.flash('danger', `${req.body.name} is already in the library.`);

            else
                req.flash('success', `Title created: ${req.body.name}!`);

            res.redirect('/game_titles/');
        });
    }
});

module.exports = routes;