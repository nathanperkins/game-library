const routes       = require('express').Router();

const GamePlatform = require('../models/game_platforms');

// express-validator used to validate and clean form data
// from https://express-validator.github.io/docs/
// uses validator.js
// from https://github.com/chriso/validator.js
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

routes. get('/', (req, res) => {
    const context = {
        page_title  : "Game Platform Index",
        table_name  : "game_platforms",
        pretty_name : "Game Platform",
    }

    GamePlatform.getAll({}, (err, rows, fields) => {
        if (err) throw err;

        context.rows   = rows;
        context.fields = [
            {name: 'id',           pretty: 'ID'},
            {name: 'name',         pretty: 'Name'},
            {name: 'manufacturer', pretty: 'Manufacturer'},
            {name: 'release_date', pretty: 'Release Date'},
        ]

        rows.forEach( row => {
            if (row.release_date) row.release_date = row.release_date.toLocaleDateString('en-US');
        });

        res.render('generic/table', context);
    });
});

routes.get('/new', (req, res) => {
    const data = {
        page_title  : 'New Game Platform',
    };

    res.render('game_platforms/new', data);
});

routes.post('/', [
        // validations from express-validator
        body(['name', 'manufacturer']).trim()
        .isAscii().withMessage('must be at least one character (ASCII characters only)'),
    ], (req, res) => {
    const errors = validationResult(req);

    const data = {
        page_title: 'Add Platform',
    };

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('danger', `${error.param} error: ${error.msg}`);
        });

        res.render('game_platforms/new', data);
    } else {
        // parameters for insert query
        const newPlatform = {
            name         : req.body.name,
            manufacturer : req.body.manufacturer,
            release_date : req.body.release_date || null
        };

        GamePlatform.create(newPlatform, (err, platform) => {
            if (err)
                req.flash('danger', `The ${newPlatform.name} is already in the library.`);

            else
                req.flash('success', `Platform created: ${platform.manufacturer} ${platform.name}`);

            res.redirect('/game_platforms/');
        });
    }
});

module.exports = routes; 
