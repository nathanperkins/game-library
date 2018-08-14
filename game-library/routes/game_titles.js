const routes     = require('express').Router();

const GameTitle  = require('../models/game_titles');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

routes. get('/', (req, res) => {
    const context = {
        page_title      : "Game Title Index",
        page_description: "Here are the titles currently listed in the library. To add a new title, use the button below.",
        table_name      : "game_titles",
        id_name         : "title_id",
        pretty_name     : "Game Title",
        new_endpoint    : "/game_titles/new/",
        child_endpoint  : "/game_releases/new",
        child_name      : "Release",
        update: false,
    }

    GameTitle.getAll({}, (err, rows, fields) => {
        if (err) throw err;

        context.rows   = rows;
        context.fields = [
            {name: 'id', pretty: 'ID'},
            {name: 'name', pretty: 'Name'},
            {name: 'genre', pretty: 'Genre'},
            {name: 'developer', pretty: 'Developer'},
            {name: 'producer', pretty: 'Producer'},
        ]

        res.render('generic/table', context);
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
        const newTitle = {
            name        : req.body.name,
            description : req.body.description,
            genre       : req.body.genre,
            developer   : req.body.developer,
            producer    : req.body.producer,
        };

        GameTitle.create(newTitle, (err, title) => {
            if (err) {
                req.flash('danger', err['msg'] || err['sqlMessage']);
            }
            else {
                req.flash('success', `Title created: ${title.name}!`);
            }

            res.redirect('/game_titles/');
        });
    }
});

module.exports = routes;